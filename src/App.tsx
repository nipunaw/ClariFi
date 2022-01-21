import SideBar from "./components/SideBar";
import ContentContainer from "./components/ContentContainer";

function App() {
  return (
    <div className="overall-container">
      <div className="side-container">
        <div className="pane-container">
          <SideBar />
        </div>
      </div>
      <div className="content-container">
        <div className="pane-container">
          <ContentContainer />
        </div>
      </div>
    </div>
  );
}

export default App;
