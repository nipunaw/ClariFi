import Button from "react-bootstrap/Button";
import "../css/SideBar.css";

function SideBar() {
  const menuChoices = ["Calibrate", "Profiles"];

  const menuButtons = menuChoices.map((item, index) => (
    <div className="row" key={index}>
      <Button key={index} className="side-button" variant="primary">
        {item}
      </Button>
    </div>
  ));
  return <div className="col side-bar">{menuButtons}</div>;
}

export default SideBar;
