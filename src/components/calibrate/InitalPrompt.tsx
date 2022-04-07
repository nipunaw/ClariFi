import "css/MainContent.css";
import { useAppDispatch } from "hooks";
import { nextState } from "reducers/calibrateSlice";

const InitalPrompt: React.FC<{}> = () => {
  const dispatch = useAppDispatch();

  return (
    <div className="main-content" style={{ wordBreak: "break-word" }}>
      <div className="display-message">Getting Started</div>
      <div
        style={{
          marginTop: "15px",
          marginBottom: "20px",
        }}
      >
        To proceed with using this calibration process, you must have a recording device connected. If one is not connected, you will be unable to
        proceed pass the device selection screen.
      </div>
      <button className="user-button" onClick={() => dispatch(nextState())}>
        Proceed
      </button>
    </div>
  );
};

export default InitalPrompt;
