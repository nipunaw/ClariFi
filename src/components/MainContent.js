import React from "react";
import "../css/MainContent.css";

function MainContent(props) {
  let mainMessage = "Testing this out!";
  let secondMessage = "Second Message!";
  return (
    <div className="content-box row">
      <div className="col">
        <h1>{mainMessage}</h1>
        <h2>{secondMessage}</h2>
        <div className="pt-4"></div>
      </div>
    </div>
  );
}

export default MainContent;
