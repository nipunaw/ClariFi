const Loading: React.FC<{}> = ({}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "200px",
      }}
    >
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <div className="spinner-border" role="status" />
      </div>
    </div>
  );
};

export default Loading;
