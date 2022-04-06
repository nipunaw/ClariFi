import { Profile } from "types/profile";
import "css/Profile.css";

const PorfileObject: React.FC<{
  profile: Profile;
}> = ({ profile }) => {
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    console.log("profile clicked");
  };
  return (
    <div className="profile-button" onClick={handleClick}>
      {profile.name}
    </div>
  );
};

export default PorfileObject;
