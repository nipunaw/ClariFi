import Button from "react-bootstrap/Button";
import "../css/SideBar.css";

interface MenuButton {
  displayName: string;
  state: "active" | "disabled";
}

const menuChoices: MenuButton[] = [
  {
    displayName: "Calibrate",
    state: "active",
  },
  {
    displayName: "Profiles",
    state: "disabled",
  },
];

function SideBar() {
  const menuButtons = menuChoices.map((item: MenuButton, index) => (
    <Button
      key={index}
      className="side-button"
      variant="primary"
      disabled={item.state === "disabled"}
    >
      {item.displayName}
    </Button>
  ));
  return <div className="side-bar">{menuButtons}</div>;
}

export default SideBar;
