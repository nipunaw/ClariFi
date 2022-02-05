import "../css/MainContent.css";

const NoiseInfoPrompt: React.FC<{
  advanceState: () => any;
}> = ({ advanceState }) => {
  return (
    <div className="main-content">
      <div className="display-message">Noise Test</div>
      <div style={{ marginTop: "15px", marginBottom: "20px" }}>
        This test is going to assess the ambient noise in your current
        enviornment. Please try to replicate the expected background noise.
      </div>
      <button onClick={() => advanceState()}> Proceed</button>
    </div>
  );
};

export default NoiseInfoPrompt;
