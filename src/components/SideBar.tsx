import Button from "react-bootstrap/Button";
import "../css/SideBar.css";

function SideBar() {
  const menuChoices = ["Calibrate", "Profiles"];

  const menuButtons = menuChoices.map((item, index) => (
    <Button key={index} className="side-button" variant="primary">
      {item}
    </Button>
  ));
  return <div className="side-bar">{menuButtons}</div>;
}

export default SideBar;
