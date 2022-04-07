import "css/MainContent.css";
import { useAppDispatch } from "hooks";
import { useState } from "react";
import { nextState } from "reducers/calibrateSlice";
import { createProfile } from "reducers/profileSlice";

const Process: React.FC<{}> = () => {
  const dispatch = useAppDispatch();
  const [profileName, setProfileName] = useState<string>("");
  const profileValues: number[] = [];

  return (
    <div className="main-content" style={{ wordBreak: "break-word" }}>
      <div className="display-message">ClariFi Filters</div>
      <div
        style={{
          marginTop: "15px",
          marginBottom: "20px",
        }}
      >
        Please save the calibrated filter to a profile for deployment using the
        ClariFi device. Thank you for using our application.
      </div>
      <div>
        <input
          type="text"
          className="text-field"
          id="profileName"
          onChange={(e) => setProfileName(e.target.value)}
          value={profileName}
        />
        <button
          className="user-button"
          disabled={profileName.length === 0}
          onClick={() => {
            dispatch(
              createProfile({ name: profileName, values: profileValues })
            );
            dispatch(nextState());
          }}
        >
          Save Profile
        </button>
      </div>
    </div>
  );
};

export default Process;
