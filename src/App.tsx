import SideBar from "./components/SideBar";
import { useAppDispatch, useAppSelector } from "hooks";
import { selectAppState } from "reducers/appSlice";
import { setInitalState as initalCalibrate } from "reducers/calibrateSlice";
import ContentContainer from "./components/CalibrateContainer";
import ProfileContainer from "components/ProfileContainer";
import { ApplicationState } from "enums/app";
import { useEffect } from "react";
import { setInitalState as initalProfile } from "reducers/profileSlice";

function App() {
  const dispatch = useAppDispatch();
  const appState = useAppSelector(selectAppState);

  useEffect(() => {
    dispatch(initalCalibrate());
    dispatch(initalProfile());
  }, []);

  const getAppContent = (): JSX.Element | null => {
    switch (appState) {
      case ApplicationState.Calibrate: {
        return <ContentContainer />;
      }
      case ApplicationState.Profile: {
        return <ProfileContainer />;
      }
      default:
        return null;
    }
  };

  return (
    <div className="overall-container">
      <div className="side-container">
        <div className="pane-container">
          <SideBar />
        </div>
      </div>
      <div className="content-container">
        <div className="pane-container">{getAppContent()}</div>
      </div>
    </div>
  );
}

export default App;
