import "css/MainContent.css";
import { useAppDispatch } from "hooks";
import { nextState } from "reducers/calibrateSlice";

const NoiseInfoPrompt: React.FC<{}> = () => {
  const dispatch = useAppDispatch();

  return (
    <div className="main-content" style={{ wordBreak: "break-word" }}>
      <div className="display-message">Ambient Noise Assesment</div>
      <div
        style={{
          marginTop: "15px",
          marginBottom: "20px",
        }}
      >
        This recording test will assess the ambient noise in your current
        enviornment. Please position your microphone to a desirable speaking
        position before proceeding. On the next page, you can review your selected device
        and begin recording, which will last 5-6 seconds. Please remain
        completely quiet during this time.
      </div>
      <button onClick={() => dispatch(nextState())}> Proceed</button>
    </div>
  );
};

export default NoiseInfoPrompt;
