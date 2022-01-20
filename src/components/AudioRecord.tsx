import { useEffect, useRef, useState } from "react";
import "../css/MainContent.css";
import AudioDeviceList from "./AudioDeviceList";
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

export default function AudioRecord() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [selectedDevice, setSelectedDevice] = useState<MediaDeviceInfo>();

  function handleSuccess(stream: MediaStream) {
    const audioTracks = stream.getTracks();
    console.log(audioTracks);
    if (audioRef.current) {
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

  return (
    <div className="main-content">
      <div className="display-message">
        {selectedDevice === undefined ? "Please select an audio device" : null}
      </div>
      <AudioDeviceList selectDevice={setSelectedDevice} />
      <div className="media-player">
        <audio id="gum-local" ref={audioRef} controls autoPlay></audio>
      </div>
    </div>
  );
}
