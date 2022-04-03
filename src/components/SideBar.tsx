import Button from "react-bootstrap/Button";
import {
  calibrateState,
  profileState,
  selectAppState,
} from "reducers/appSlice";
import { useAppDispatch, useAppSelector } from "hooks";
import "../css/SideBar.css";
import { ApplicationState } from "enums/app";

interface MenuButton {
  displayName: string;
  menuEnum: ApplicationState;
  state: "active" | "disabled";
  dispatchAction: any;
}

const menuChoices: MenuButton[] = [
  {
    displayName: "Calibrate",
    menuEnum: ApplicationState.Calibrate,
    state: "active",
    dispatchAction: calibrateState(),
  },
  {
    displayName: "Profiles",
    menuEnum: ApplicationState.Profile,
    state: "active",
    dispatchAction: profileState(),
  },
];

function SideBar() {
  const dispatch = useAppDispatch();
  const appState = useAppSelector(selectAppState);
  const menuButtons = menuChoices.map((item: MenuButton, index) => (
    <Button
      key={index}
      style={{
        backgroundColor:
          item.menuEnum === appState ? "var(--darker-color)" : "inherit",
      }}
      className="side-button"
      variant="primary"
      disabled={item.state === "disabled"}
      onClick={() => dispatch(item.dispatchAction)}
    >
      {item.displayName}
    </Button>
  ));
  return <div className="side-bar">{menuButtons}</div>;
}

export default SideBar;
