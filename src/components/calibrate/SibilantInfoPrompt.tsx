import "css/MainContent.css";
import { useAppDispatch } from "hooks";
import { nextState } from "reducers/calibrateSlice";

const SibilantInfoPrompt: React.FC<{}> = () => {
  const dispatch = useAppDispatch();

  return (
    <div className="main-content" style={{ wordBreak: "break-word" }}>
      <div className="display-message">Sibilant Noise Assesment</div>
      <div
        style={{
          marginTop: "15px",
          marginBottom: "20px",
        }}
      >
        This recording test will assess the sibilant noise in your speech
        pattern. Please position your microphone to a desirable speaking
        position before proceeding. On the next page, you can review your
        selected device and begin recording, which will last 5-6 seconds. Please
        sound out the letter "s" at a consistent pitch while recording.
      </div>
      <button onClick={() => dispatch(nextState())}> Proceed</button>
    </div>
  );
};

export default SibilantInfoPrompt;
