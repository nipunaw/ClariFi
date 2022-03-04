import { useState } from "react";
import "css/MainContent.css";
import AudioRecord from "./calibrate/AudioRecord";
import NoiseInfoPrompt from "./calibrate/NoiseInfoPrompt";
import { useAppSelector } from "hooks";
import { selectCalibrate } from "reducers/calibrateSlice";
import DeviceConfigure from "./calibrate/DeviceConfigure";
import { Calibrate } from "enums/calibrate";

export default function ContentContainer() {
  const { currentState: calibrateState } = useAppSelector(selectCalibrate);

  const getContent = (): JSX.Element | null => {
    switch (calibrateState) {
      case Calibrate.deviceConfig:
        return <DeviceConfigure />;
      case Calibrate.audioTest1:
      case Calibrate.audioTest2:
        return <AudioRecord />;
    }
    return null;
  };

  return (
    <div className="inner-container">
      <div className="overflow-content">{getContent()}</div>
    </div>
  );
}
