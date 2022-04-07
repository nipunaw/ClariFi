import { Profile } from "types/profile";
import "css/Profile.css";
import { useAppDispatch } from "hooks";
import { setSelectedProfile } from "reducers/profileSlice";

const PorfileObject: React.FC<{
  profile: Profile;
  isSelected: boolean;
}> = ({ profile, isSelected }) => {
  const classStyle = isSelected
    ? "profile-button profile-button-selected"
    : "profile-button";

  const dispatch = useAppDispatch();

  return (
    <div
      className={classStyle}
      onClick={() => dispatch(setSelectedProfile(profile.id))}
    >
      {profile.name}
    </div>
  );
};

export default PorfileObject;
