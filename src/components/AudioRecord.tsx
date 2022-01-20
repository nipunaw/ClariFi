import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import "../css/MainContent.css";
import MainContent from "./MainContent";
//const electron = window.require("electron");

export default function AudioRecord() {
  // Put variables in global scope to make them available to the browser console.
  const audio = document.querySelector("audio");

  const constraints = {
    audio: true,
    video: false,
  };

  const setAudio = (stream: MediaStream) => {
    if (audio) {
      audio.srcObject = stream;
    }
  };

  function handleSuccess(stream: MediaStream) {
    const audioTracks = stream.getAudioTracks();
    console.log("Got stream with constraints:", constraints);
    console.log("Using audio device: " + audioTracks[0].label);
    /*
    stream.oninactive = function () {
      console.log("Stream ended");
    };
    */
    setAudio(stream);
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
    console.log("here");
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(handleSuccess)
      .catch(handleError);
  }, []);

  if (!audio) {
    return null;
  }

  return <div></div>;
}
