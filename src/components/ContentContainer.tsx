import "css/MainContent.css";
import AudioRecord from "./calibrate/AudioRecord";
import NoiseInfoPrompt from "./calibrate/NoiseInfoPrompt";
import { useAppSelector } from "hooks";
import { selectCalibrate } from "reducers/calibrateSlice";
import DeviceConfigure from "./calibrate/DeviceConfigure";
import { Calibrate } from "enums/calibrate";
import Process from "./calibrate/Process";

export default function ContentContainer() {
  const { currentState: calibrateState } = useAppSelector(selectCalibrate);

  const getContent = (): JSX.Element | null => {
    switch (calibrateState) {
      case Calibrate.initalMenu:
        return null;
      case Calibrate.deviceConfig:
        return <DeviceConfigure />;
      case Calibrate.prompt1:
        return <NoiseInfoPrompt />;
      case Calibrate.audioTest1:
        return <AudioRecord key={1} />;
      case Calibrate.process:
        return <Process />;
    }
  };

  return (
    <div className="inner-container">
      <div className="overflow-content">{getContent()}</div>
    </div>
  );
}
