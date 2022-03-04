import "css/MainContent.css";
import { useAppDispatch } from "hooks";
import { nextState } from "reducers/calibrateSlice";

const Process: React.FC<{}> = () => {
  const dispatch = useAppDispatch();

  return (
    <div className="main-content" style={{ wordBreak: "break-word" }}>
      <div className="display-message">Initalize FPGA</div>
      <div
        style={{
          marginTop: "15px",
          marginBottom: "20px",
        }}
      >
        If connected, the recorded data will be sent via SPI to the FPGA.
      </div>
    </div>
  );
};

export default Process;
