import { useState } from "react";
import "css/MainContent.css";
import AudioRecord from "./calibrate/AudioRecord";
import NoiseInfoPrompt from "./calibrate/NoiseInfoPrompt";
// const electron = window.require("electron");

enum ContentState {
  NoiseInfo,
  NoiseRecording,
}

export default function ContentContainer() {
  const [state, setState] = useState(ContentState.NoiseInfo);

  const stateHandler = () => {
    switch (state) {
      case ContentState.NoiseInfo: {
        setState(ContentState.NoiseRecording);
      }
    }
  };

  const getContent = (): JSX.Element => {
    switch (state) {
      case ContentState.NoiseInfo:
        return <NoiseInfoPrompt advanceState={stateHandler} />;
      case ContentState.NoiseRecording:
        return <AudioRecord />;
    }
  };

  return (
    <div className="inner-container">
      <div className="overflow-content">{getContent()}</div>
    </div>
  );
}
