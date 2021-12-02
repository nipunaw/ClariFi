import "./App.css";
import SideBar from "./components/SideBar";
import MainContent from "./components/MainContent";

function App() {
  return (
    <div className="row">
      <div className="col-3">
        <SideBar />
      </div>
      <div className="col">
        <MainContent />
      </div>
    </div>
  );
}

export default App;
