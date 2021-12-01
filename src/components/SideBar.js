import React from "react";
import Button from "react-bootstrap/Button";

function SideBar(props) {
  const menuChoices = ["Calibrate", "Menu"];

  const menuButtons = menuChoices.map((item, index) => (
    <div className="row">
      <Button key={index} variant="primary">
        {item}
      </Button>
    </div>
  ));
  return <div className="col">{menuButtons}</div>;
}

export default SideBar;
