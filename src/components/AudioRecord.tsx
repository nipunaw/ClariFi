import { useEffect, useState } from "react";
import "../css/MainContent.css";
import AudioDeviceList from "./AudioDeviceList";
import { writeSerial } from "functions/serial";
const electron = window.require("electron");

enum AudioState {
  Loading,
  Recording,
  Ready,
  Idle,
}

interface AudioDevice extends MediaStreamConstraints {
  audio: {
    deviceId: string | undefined;
  };
}

var constraints: AudioDevice = {
  audio: {
    deviceId: undefined,
  },
};

const handleDataAvailable = (event: BlobEvent) => {
  let audioCtx = new AudioContext();
  event.data.arrayBuffer().then((arrayBuf) => {
    audioCtx.decodeAudioData(arrayBuf).then((buffer) => {
      const float32Array = buffer.getChannelData(0); // get a single channel of sound
      electron.ipcRenderer.send("process-audio", float32Array);
      const data = new Uint8Array([104, 101, 108, 108, 111]); // hello
      writeSerial(data);
    });
  });
};

export default function AudioRecord() {
  //const audioRef = useRef<HTMLAudioElement>(null);
  const [state, setState] = useState<AudioState>(AudioState.Idle);
  const [mediaStream, setMediaStream] = useState<MediaStream>();
  const [recorder, setRecorder] = useState<MediaRecorder>();
  const [selectedDevice, setSelectedDevice] = useState<MediaDeviceInfo>();
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>();

  useEffect(() => {
    electron.ipcRenderer.on("audio-finished", (event, message) => {
      setState(AudioState.Ready);
      setFeedbackMsg(message);
    });
  }, []);

  function handleSuccess(stream: MediaStream) {
    setMediaStream(stream);
    const options = { mimeType: "audio/webm" };
    const _recorder = new MediaRecorder(stream, options);
    setRecorder(_recorder);
    //audioRef.current.srcObject = stream;
  }

  function handleError(error: Error) {
    const errorMessage =
      "navigator.MediaDevices.getUserMedia error: " +
      error.message +
      " " +
      error.name;
    console.log(errorMessage);
  }

  useEffect(() => {
    if (selectedDevice) {
      setState(AudioState.Ready);
    }
  }, [selectedDevice]);

  useEffect(() => {
    if (recorder) {
      recorder.ondataavailable = handleDataAvailable;
      recorder.start();
    }
  }, [recorder]);

  const handleClick = () => {
    if (state === AudioState.Ready && selectedDevice) {
      setFeedbackMsg(null);
      setState(AudioState.Recording);
      constraints.audio.deviceId = selectedDevice.deviceId;
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(handleSuccess)
        .catch(handleError);
    } else if (state === AudioState.Recording) {
      setState(AudioState.Loading);
      if (recorder) {
        recorder.stop();
        setRecorder(undefined);
      }
      if (mediaStream) {
        setMediaStream(undefined);
      }
    }
  };

  const getButton = () => {
    let buttonDisplay: string = "";
    let isDisabled: boolean = true;

    switch (state) {
      case AudioState.Idle: {
        buttonDisplay = "Waiting";
        isDisabled = true;
        break;
      }
      case AudioState.Recording: {
        buttonDisplay = "Click to Stop";
        isDisabled = false;
        break;
      }
      case AudioState.Ready: {
        buttonDisplay = "Click to Start";
        isDisabled = false;
        break;
      }
      case AudioState.Loading: {
        buttonDisplay = "Processing...";
        isDisabled = true;
      }
    }
    return (
      <button onClick={handleClick} disabled={isDisabled}>
        {buttonDisplay}
      </button>
    );
  };

  const getStateMessage = (): string | null => {
    if (state === AudioState.Idle) {
      return "Please select an audio device";
    } else if (state === AudioState.Loading) {
      return "Processing...";
    } else if (state === AudioState.Recording) {
      return "Recording...";
    }
    return null;
  };

  return (
    <div className="main-content">
      <div className="display-message">
        {getStateMessage()}
        {feedbackMsg}
      </div>
      <AudioDeviceList selectDevice={setSelectedDevice} />
      {/*
      <div className="media-player">
        <audio id="gum-local" ref={audioRef} controls autoPlay></audio>
      </div>
      */}
      {getButton()}
    </div>
  );
}