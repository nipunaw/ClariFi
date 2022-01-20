import "./css/App.css";
import SideBar from "./components/SideBar";
import ContentContainer from "./components/ContentContainer";

function App() {
  return (
    <div className="row no-gutter" style={{ minHeight: "100vh" }}>
      <div className="col-3" style={{ paddingRight: 0 }}>
        <SideBar />
      </div>
      <div className="col content-box">
        <ContentContainer />
      </div>
    </div>
  );
}

export default App;
