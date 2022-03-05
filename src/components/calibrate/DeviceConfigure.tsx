import { useEffect, useState } from "react";
import "css/MainContent.css";
import AudioDeviceList from "./AudioDeviceList";
import { useAppDispatch } from "hooks";
import { nextState, setDeviceId } from "reducers/calibrateSlice";
const electron = window.require("electron");

enum AudioState {
  Idle,
  Ready,
}

export default function DeviceConfigure() {
  const [state, setState] = useState<AudioState>(AudioState.Idle);
  const [selectedDevice, setSelectedDevice] = useState<MediaDeviceInfo>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (selectedDevice) {
      setState(AudioState.Ready);
    }
  }, [selectedDevice]);

  const handleClick = () => {
    if (state === AudioState.Ready && selectedDevice) {
      dispatch(setDeviceId(selectedDevice.deviceId));
      dispatch(nextState());
    }
  };

  const getButton = () => {
    let buttonDisplay: string = "";
    let isDisabled: boolean = true;

    switch (state) {
      case AudioState.Idle: {
        buttonDisplay = "Waiting";
        isDisabled = true;
        break;
      }
      case AudioState.Ready: {
        buttonDisplay = "Click to Proceed";
        isDisabled = false;
        break;
      }
    }
    return (
      <button onClick={handleClick} disabled={isDisabled}>
        {buttonDisplay}
      </button>
    );
  };

  return (
    <div className="main-content">
      <div className="display-message">{"Please select a recording device from below:"}</div>
      <AudioDeviceList selectDevice={setSelectedDevice} />
      {getButton()}
    </div>
  );
}
