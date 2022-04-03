import "css/MainContent.css";
import { useAppDispatch } from "hooks";
import { nextState } from "reducers/calibrateSlice";

const ProfileDisp: React.FC<{}> = () => {
  const dispatch = useAppDispatch();

  return (
    <div className="main-content" style={{ wordBreak: "break-word" }}>
      <div className="display-message">Profiles</div>
      <div
        style={{
          marginTop: "15px",
          marginBottom: "20px",
        }}
      >
        The profiles will be dipslayed here.
      </div>
    </div>
  );
};

export default ProfileDisp;
