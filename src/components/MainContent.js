import React from "react";
import Button from "react-bootstrap/Button";
import "../css/MainContent.css";

function MainContent(props) {
  let mainMessage = "Recording Audio Stage";
  let secondMessage = "Press the button below to record...";
  let buttonMessage = "Record";

  const clickHandler = (event) => {
    window.ipcRenderer.send("recordButton");
  };

  return (
    <div className="row">
      <h1>{mainMessage}</h1>
      <h2>{secondMessage}</h2>

      <div className="mt-3">
        <Button
          className="side-button"
          variant="primary"
          style={{ width: "100%" }}
          onClick={clickHandler}
        >
          {buttonMessage}
        </Button>
      </div>
    </div>
  );
}

export default MainContent;
