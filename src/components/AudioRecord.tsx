import { useEffect, useRef, useState } from "react";
import "../css/MainContent.css";
import AudioDeviceList from "./AudioDeviceList";
import * as Pitchfinder from "pitchfinder";
//const electron = window.require("electron");

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

interface AnalyzeData {
  pitch: number;
}

const handleDataAvailable = (event: BlobEvent) => {
  let audioCtx = new AudioContext();
  event.data.arrayBuffer().then((arrayBuf) => {
    audioCtx.decodeAudioData(arrayBuf).then((buffer) => {
      const float32Array = buffer.getChannelData(0); // get a single channel of sound
      const detectPitch = Pitchfinder.AMDF();
      const pitch = detectPitch(float32Array);
      console.log(`Pitch: ${pitch}`);
      return buffer;
    });
  });
};

export default function AudioRecord() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [recorder, setRecorder] = useState<MediaRecorder>();
  const [selectedDevice, setSelectedDevice] = useState<MediaDeviceInfo>();

  function handleSuccess(stream: MediaStream) {
    if (audioRef.current) {
      const options = { mimeType: "audio/webm" };
      const _recorder = new MediaRecorder(stream, options);
      setRecorder(_recorder);
      audioRef.current.srcObject = stream;
    }
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
      constraints.audio.deviceId = selectedDevice.deviceId;
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(handleSuccess)
        .catch(handleError);
    }
  }, [selectedDevice]);

  useEffect(() => {
    if (recorder) {
      recorder.ondataavailable = handleDataAvailable;
      recorder.start();
    }
  }, [recorder]);

  const handleClick = () => {
    if (recorder) {
      recorder.stop();
      setRecorder(undefined);
    }
  };

  return (
    <div className="main-content">
      <div className="display-message">
        {selectedDevice === undefined ? "Please select an audio device" : null}
      </div>
      <AudioDeviceList selectDevice={setSelectedDevice} />
      <div className="media-player">
        <audio id="gum-local" ref={audioRef} controls autoPlay></audio>
      </div>
      <button onClick={handleClick}>Click To Stop</button>
    </div>
  );
}
