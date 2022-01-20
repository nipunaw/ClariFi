import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
const { desktopCapturer, remote } = require("electron");
const { BrowserWindow } = remote;
import { writeFile } from "fs";

// WORK IN PROGRESS CODE

function MicInterface() {
  const { dialog, Menu } = remote;

  // Global state
  let mediaRecorder; // MediaRecorder instance to capture footage
  const recordedChunks = [];

  // Captures all recorded chunks
  function handleDataAvailable(e) {
    console.log("video data available");
    recordedChunks.push(e.data);
  }

  // Saves the video file on stop
  async function handleStop(e) {
    const blob = new Blob(recordedChunks, {
      type: "video/webm; codecs=vp9",
    });

    const buffer = Buffer.from(await blob.arrayBuffer());

    const { filePath } = await dialog.showSaveDialog({
      buttonLabel: "Save video",
      defaultPath: `vid-${Date.now()}.webm`,
    });

    if (filePath) {
      writeFile(filePath, buffer, () =>
        console.log("video saved successfully!")
      );
    }
  }

  // Change the videoSource window to record
  async function selectSource(source) {
    const constraints = {
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: "desktop",
          chromeMediaSourceId: source.id,
        },
      },
    };

    // Create a Stream
    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    // Preview the source in a video element
    videoElement.srcObject = stream;
    videoElement.play();

    // Create the Media Recorder
    const options = { mimeType: "video/webm; codecs=vp9" };
    mediaRecorder = new MediaRecorder(stream, options);

    // Register Event Handlers
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.onstop = handleStop;

    // Updates the UI
  }

  // Get the available video sources
  async function getVideoSources() {
    const inputSources = await desktopCapturer.getSources({
      types: ["window", "screen"],
    });

    const videoOptionsMenu = Menu.buildFromTemplate(
      inputSources.map((source) => {
        return {
          label: source.name,
          click: () => selectSource(source),
        };
      })
    );

    videoOptionsMenu.popup();
  }

  return (
    <div>
      <h3>Select your input device below</h3>
      <Button onClick={() => mediaRecorder.start()}>Start</Button>
      <Button onClick={() => mediaRecorder.stop()}>Stop</Button>
      <Button onClick={getVideoSources}>Select</Button>
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Device Selection
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
          <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
          <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default MicInterface;
