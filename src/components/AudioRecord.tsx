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

const RECORD_MS_TIME = 5500;

const handleStart = (event: Event) => {
  setTimeout(function () {
    let eventRecorder = event.target as MediaRecorder;
    eventRecorder.stop();
  }, RECORD_MS_TIME);
};

const handleStop = (setRecorderState: () => void, updateState: () => void) => {
  setRecorderState();
  updateState();
};

const handleDataAvailable = (event: BlobEvent) => {
  let audioCtx = new AudioContext();
  event.data.arrayBuffer().then((arrayBuf) => {
    audioCtx.decodeAudioData(arrayBuf).then((buffer) => { //sample rate is 48kHz for my device
      const rawRecordedData = buffer.getChannelData(0); // get a single channel of sound
      const sampleRate = audioCtx.sampleRate
      electron.ipcRenderer.send("process-audio", rawRecordedData, sampleRate);
      const data = new Uint8Array([104, 101, 108, 108, 111]); // hello
      writeSerial(data).then((status) => {
        console.log(status);
      });
    });
  });
};

export default function AudioRecord() {
  const [state, setState] = useState<AudioState>(AudioState.Idle);
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
    const options = { mimeType: "audio/webm" };
    const _recorder = new MediaRecorder(stream, options);
    _recorder.onstart = handleStart;
    _recorder.onstop = () =>
      handleStop(
        () => setRecorder(undefined),
        () => setState(AudioState.Loading)
      );
    _recorder.ondataavailable = handleDataAvailable;
    _recorder.start();
    setRecorder(_recorder);
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

  const handleClick = () => {
    if (state === AudioState.Ready && selectedDevice) {
      setFeedbackMsg(null);
      setState(AudioState.Recording);
      constraints.audio.deviceId = selectedDevice.deviceId;
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(handleSuccess)
        .catch(handleError);
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
        buttonDisplay = "Recording...";
        isDisabled = true;
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
      {getButton()}
    </div>
  );
}
