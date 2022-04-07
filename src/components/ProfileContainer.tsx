import "css/MainContent.css";
import { useAppSelector } from "hooks";
import ProfileDisp from "./profile/ProfileDisp";

export default function ProfileContainer() {
  const getContent = (): JSX.Element | null => {
    return <ProfileDisp />;
  };

  return (
    <div className="inner-container">
      <div className="overflow-content">{getContent()}</div>
    </div>
  );
}
