import "css/MainContent.css";
import { useAppDispatch } from "hooks";
import { nextState } from "reducers/calibrateSlice";

const Process: React.FC<{}> = () => {
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
        If the ClariFi device is connected, the calculated filter taps have been transmitted via SPI to the FPGA. Thank you for using our application.
      </div>
    </div>
  );
};

export default Process;
