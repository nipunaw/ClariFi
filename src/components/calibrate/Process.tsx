import "css/MainContent.css";
import { useAppDispatch, useAppSelector } from "hooks";
import { useState, useEffect } from "react";
import { selectAnalysis } from "reducers/analysisSlice";
import { nextState } from "reducers/calibrateSlice";
import { createProfile } from "reducers/profileSlice";
const electron = window.require("electron");

const Process: React.FC<{}> = () => {
  const dispatch = useAppDispatch();
  const analysisData = useAppSelector(selectAnalysis);
  const [profileName, setProfileName] = useState<string>("");
  const [coData, setCoData] = useState<number[]>([]);

  useEffect(() => {
    let combinedData: number[] = analysisData.ambientData[0].concat(analysisData.sibilantData[0]);

    electron.ipcRenderer.send(
      "process-audio",
      combinedData,
      analysisData.samplingRate,
      "coefficients"
    );

    electron.ipcRenderer.on(
      "audio-finished",
      (event, status, message, data) => {
        console.log(status);
        if (status === true) {
          console.log(data)
          setCoData(data);
        }
      }
    );
  }, []);



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
          disabled={profileName.length === 0 || coData.length === 0}
          onClick={() => {
            dispatch(
              createProfile({ name: profileName, values: coData })
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
