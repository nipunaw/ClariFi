import { useEffect, useRef, useState } from "react";
import "../css/MainContent.css";
import AudioDeviceList from "./AudioDeviceList";
//const electron = window.require("electron");

const constraints: MediaStreamConstraints = {
  audio: {
    deviceId: undefined,
  },
};

export default function AudioRecord() {
  const audioRef = useRef(null);
  const [selectedDevice, setSelectedDevice] = useState<MediaDeviceInfo>();
  const [audio, setAduioObject] = useState<HTMLAudioElement | null>(null);
  const [steamTrack, setStreamTrack] = useState<MediaStreamTrack>();

  const setAudioTrack = (stream: MediaStream) => {
    if (audio) {
      audio.srcObject = stream;
    }
  };

  function handleSuccess(stream: MediaStream) {
    const audioTracks = stream.getTracks();
    console.log(audioTracks);
    console.log("Got stream with constraints:", constraints);
    setStreamTrack(audioTracks[0]);
    //setAudioTrack(stream);
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
    setAduioObject(audioRef.current);
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(handleSuccess)
      .catch(handleError);
  }, []);

  return (
    <div className="main-content">
      <AudioDeviceList selectDevice={setSelectedDevice} />
      <audio id="gum-local" ref={audioRef} controls autoPlay></audio>
      <h1>{`Using device: ${selectedDevice?.deviceId}`}</h1>
    </div>
  );
}
