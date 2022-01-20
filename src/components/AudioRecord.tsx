import { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import "../css/MainContent.css";
import MainContent from "./MainContent";
//const electron = window.require("electron");

const constraints = {
  audio: true,
  video: false,
};

export default function AudioRecord() {
  const audioRef = useRef(null);
  const [audio, setAduioObject] = useState<HTMLAudioElement | null>(null);
  const [steamTrack, setStreamTrack] = useState<MediaStreamTrack>();

  const setAudioTrack = (stream: MediaStream) => {
    if (audio) {
      audio.srcObject = stream;
    }
  };

  function handleSuccess(stream: MediaStream) {
    const audioTracks = stream.getAudioTracks();
    console.log("Got stream with constraints:", constraints);
    setStreamTrack(audioTracks[0]);
    setAudioTrack(stream);
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
    <div>
      <audio id="gum-local" ref={audioRef} controls autoPlay></audio>
      <h1>{`Using device: ${steamTrack?.label}`}</h1>
    </div>
  );
}
