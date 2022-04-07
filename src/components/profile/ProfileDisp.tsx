import "css/MainContent.css";
import { useAppDispatch, useAppSelector } from "hooks";
import {
  selectAllProfiles,
  selectSelectedProfileId,
} from "reducers/profileSlice";
import PorfileObject from "./ProfileObject";

const ProfileDisp: React.FC<{}> = () => {
  const dispatch = useAppDispatch();
  const profiles = useAppSelector(selectAllProfiles);
  const selectedProfile = useAppSelector(selectSelectedProfileId);

  const getProfiles = (): JSX.Element[] => {
    return profiles.map((profile, index: number) => {
      return (
        <PorfileObject
          key={index}
          isSelected={selectedProfile == profile.id}
          profile={profile}
        />
      );
    });
  };

  const getContextMenu = () => {
    const contextMenu = "here";

    return (
      <div className="context-menu">
        {selectedProfile !== null ? contextMenu : null}
      </div>
    );
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
        {getContextMenu()}
        {getProfiles()}
      </div>
    </div>
  );
};

export default ProfileDisp;
