import React from "react";
import Button from "react-bootstrap/Button";
import "../css/MainContent.css";
import { ipcRenderer } from "electron";

function MainContent(props) {
  let mainMessage = "Testing this out!";
  let secondMessage = "Second Message!";
  let buttonMessage = "Record";

  const clickHandler = (event) => {
    ipcRenderer.send("recordButton");
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
          onClick={() => clickHandler}
        >
          {buttonMessage}
        </Button>
      </div>
    </div>
  );
}

export default MainContent;
