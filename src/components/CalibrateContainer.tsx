import "css/MainContent.css";
import AudioRecord from "./calibrate/AudioRecord";
import NoiseInfoPrompt from "./calibrate/NoiseInfoPrompt";
import { useAppSelector, useAppDispatch } from "hooks";
import { setInitalState } from "reducers/calibrateSlice";
import { selectCalibrate } from "reducers/calibrateSlice";
import DeviceConfigure from "./calibrate/DeviceConfigure";
import { Calibrate } from "enums/calibrate";
import Process from "./calibrate/Process";
import SibilantInfoPrompt from "./calibrate/SibilantInfoPrompt";
import ProcessTest from "./calibrate/ProcessTest";
import InitalPrompt from "./calibrate/InitalPrompt";

export default function CalibrateContainer() {
  const { currentState: calibrateState } = useAppSelector(selectCalibrate);
  const dispatch = useAppDispatch();

  const getContent = (): JSX.Element | null => {
    switch (calibrateState) {
      case Calibrate.initalMenu:
        return <InitalPrompt />;
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

  const getButton = () => {
    if (
      calibrateState != Calibrate.initalMenu &&
      calibrateState != Calibrate.process
    ) {
      return (
        <button
          className="user-button"
          style={{
            backgroundColor: "var(--red-color)",
            borderColor: "var(--red-color)",
          }}
          onClick={() => dispatch(setInitalState())}
        >
          Start Over
        </button>
      );
    }
    return null;
  };

  return (
    <div className="inner-container">
      <div className="overflow-content">
        {getContent()} {getButton()}
      </div>
    </div>
  );
}
