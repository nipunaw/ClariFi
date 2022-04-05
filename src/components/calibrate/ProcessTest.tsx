import "css/MainContent.css";
import { useAppDispatch } from "hooks";
import { nextState } from "reducers/calibrateSlice";

const ProcessTest: React.FC<{}> = () => {
  const dispatch = useAppDispatch();

  return (
    <div className="main-content" style={{ wordBreak: "break-word" }}>
      <div className="display-message">ClariFi Filters</div>
      <div
        style={{
          marginTop: "15px",
          marginBottom: "20px",
        }}
      >
        If the ClariFi device is connected, the calculated filter taps have been
        transmitted via SPI to the FPGA. Please proceed with the next test.
      </div>
      <button onClick={() => dispatch(nextState())}> Proceed</button>
    </div>
  );
};

export default ProcessTest;
