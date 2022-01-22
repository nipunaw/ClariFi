import "../css/MainContent.css";
// import MainContent from "./MainContent";
import AudioRecord from "./AudioRecord";
// const electron = window.require("electron");

export default function ContentContainer() {
  return (
    <div className="inner-container">
      <div className="overflow-content">
        <AudioRecord />
      </div>
    </div>
  );
}