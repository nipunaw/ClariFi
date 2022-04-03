import SideBar from "./components/SideBar";
import { useAppSelector } from "hooks";
import { selectAppState } from "reducers/appSlice";
import ContentContainer from "./components/CalibrateContainer";
import ProfileContainer from "components/ProfileContainer";
import { ApplicationState } from "enums/app";

function App() {
  const appState = useAppSelector(selectAppState);

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
