import Button from "react-bootstrap/Button";
import {
  calibrateState,
  profileState,
  selectAppState,
} from "reducers/appSlice";
import { setInitalState as calibrateInital } from "reducers/calibrateSlice";
import { setInitalState as profileInital } from "reducers/profileSlice";
import { useAppDispatch, useAppSelector } from "hooks";
import "../css/SideBar.css";
import { ApplicationState } from "enums/app";

interface MenuButton {
  displayName: string;
  menuEnum: ApplicationState;
  state: "active" | "disabled";
  dispatchAction: any;
  initalState: any;
}

const menuChoices: MenuButton[] = [
  {
    displayName: "Calibrate",
    menuEnum: ApplicationState.Calibrate,
    state: "active",
    dispatchAction: calibrateState(),
    initalState: calibrateInital(),
  },
  {
    displayName: "Profiles",
    menuEnum: ApplicationState.Profile,
    state: "active",
    dispatchAction: profileState(),
    initalState: profileInital(),
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
      onClick={() => {
        dispatch(item.dispatchAction);
        dispatch(item.initalState);
      }}
    >
      {item.displayName}
    </Button>
  ));
  return <div className="side-bar">{menuButtons}</div>;
}

export default SideBar;
