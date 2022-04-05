import "css/MainContent.css";
import AudioRecord from "./calibrate/AudioRecord";
import NoiseInfoPrompt from "./calibrate/NoiseInfoPrompt";
import { useAppSelector } from "hooks";
import { selectCalibrate } from "reducers/calibrateSlice";
import DeviceConfigure from "./calibrate/DeviceConfigure";
import { Calibrate } from "enums/calibrate";
import Process from "./calibrate/Process";
import SibilantInfoPrompt from "./calibrate/SibilantInfoPrompt";
import ProcessTest from "./calibrate/ProcessTest";

export default function CalibrateContainer() {
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
      case Calibrate.processTest:
        return <ProcessTest />;
      case Calibrate.prompt2:
        return <SibilantInfoPrompt />;
      case Calibrate.audioTest2:
        return <AudioRecord key={2} />;
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
