import { React, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import "../css/MainContent.css";

function MainContent(props) {
  const defaultMessages = {
    mainMessage: "Recording Audio Stage",
    secondMessage: "Press the button below to record 5 seconds...",
  };
  const [buttonMessage, setButtonMessage] = useState("Record");
  const [isRecordingFinished, setRecordingStatus] = useState(false);
  const [recordingData, setRecordingData] = useState(null);
  const [displayMessages, setDisplayMessages] = useState(defaultMessages);
  const [displayResult, setDisplayResult] = useState(null);

  const getImage = (imageInfo) => {
    /*
    {
        imageInfo: {
            alt: Alt string text
            fsPath: Path to the image on file system
        }
    }
    */
    if (imageInfo)
      return (
        <div className="img-display">
          <img
            alt={imageInfo.alt}
            src={imageInfo.fsPath}
            style={{ objectFit: "contain", height: "100%", width: "100%" }}
          />
        </div>
      );

    return <p>{imageInfo.alt}</p>;
  };

  const displayRecordingResults = (recordingData) => {
    if (!recordingData) {
      return null;
    }
    let headerLabel = <h2>Magnitude Frequency Response: </h2>;
    let image = getImage(recordingData.imageInfo);

    return (
      <div className="mt-5">
        {headerLabel}
        {image}
      </div>
    );
  };

  const clickHandler = (event) => {
    setButtonMessage("Running...");
    window.ipcRenderer.send("recordButton");
  };

  useEffect(() => {
    window.ipcRenderer.on("recordMain", function (evt, message) {
      console.log(message);
      if (message.STATUS === "finished") {
        setButtonMessage("Finished!");
        let url = "http://127.0.0.1:8080/" + message.IMG_PATH;
        let recievedData = {
          imageInfo: { fsPath: url, alt: message.IMG_ALT },
        };
        setRecordingData(recievedData);
        setRecordingStatus(true);
        setDisplayMessages({
          ...displayMessages,
          secondMessage: "Audio recording saved to " + message.IMG_PATH,
        });
      }
    });
  }, []);

  useEffect(() => {
    let result = displayRecordingResults(recordingData);
    setDisplayResult(result);
  }, [isRecordingFinished]);

  return (
    <div className="row">
      <h1>{displayMessages.mainMessage}</h1>
      <h2>{displayMessages.secondMessage}</h2>

      <div className="mt-3">
        <Button
          className="side-button"
          variant="primary"
          style={{ width: "100%" }}
          onClick={clickHandler}
          disabled={isRecordingFinished ? true : false}
        >
          {buttonMessage}
        </Button>
        <h2>{isRecordingFinished ? displayResult : null}</h2>
      </div>
    </div>
  );
}

export default MainContent;
