import React from "react";
import Dropdown from "react-bootstrap/Dropdown";

function MicInterface(props) {
  return (
    <div>
      <h3>Select your input device below</h3>
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
