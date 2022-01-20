import { useEffect } from "react";
import "css/Media.css";
import { useState } from "react";

const getDeviceButtons = (devices: MediaDeviceInfo[]): JSX.Element[] => {
  return devices
    .filter((currentDevice) => {
      if (currentDevice.kind === "audioinput") {
        return currentDevice;
      }
    })
    .map((validDevice, index) => {
      let deviceLabel = validDevice.label;
      return (
        <div key={index} className="device-button">
          {deviceLabel}
        </div>
      );
    });
};

export default function AudioDeviceList() {
  const [buttons, setButtons] = useState<JSX.Element[]>([]);

  const handleSuccess = (devices: MediaDeviceInfo[]) => {
    const buttonList = getDeviceButtons(devices);
    setButtons(buttonList);
  };

  useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then(handleSuccess)
      .catch((err) => console.log(err));
  }, []);

  return <div>{buttons}</div>;
}
