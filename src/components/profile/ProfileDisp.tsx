import "css/MainContent.css";
import { useAppDispatch, useAppSelector } from "hooks";
import { selectAllProfiles } from "reducers/profileSlice";
import { nextState } from "reducers/calibrateSlice";
import PorfileObject from "./ProfileObject";

const ProfileDisp: React.FC<{}> = () => {
  const dispatch = useAppDispatch();
  const profiles = useAppSelector(selectAllProfiles);

  const getProfiles = (): JSX.Element[] => {
    return profiles.map((profile, index: number) => {
      return <PorfileObject profile={profile} />;
    });
  };

  return (
    <div className="main-content" style={{ wordBreak: "break-word" }}>
      <div className="display-message">Profiles</div>
      <div
        style={{
          marginTop: "15px",
          marginBottom: "20px",
        }}
      >
        {getProfiles()}
      </div>
    </div>
  );
};

export default ProfileDisp;
