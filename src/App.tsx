import "./css/App.css";
import SideBar from "./components/SideBar";
import MainContent from "./components/MainContent";

function App() {
  return (
    <div className="row no-gutter" style={{ minHeight: "100vh" }}>
      <div className="col-3" style={{ paddingRight: 0 }}>
        <SideBar />
      </div>
      <div className="col content-box">
        <MainContent />
      </div>
    </div>
  );
}

export default App;
