import "../css/MainContent.css";

const NoiseInfoPrompt: React.FC<{
  advanceState: () => any;
}> = ({ advanceState }) => {
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
        enviornment. Please position your microphone to a desirable speaking position
        before proceeding. On the next page, you can select your device and begin recording,
        which will last 5-6 seconds. Please remain completely quiet during this time.
      </div>
      <button onClick={() => advanceState()}> Proceed</button>
    </div>
  );
};

export default NoiseInfoPrompt;
