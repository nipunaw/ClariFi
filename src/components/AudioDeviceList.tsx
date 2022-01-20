import { useEffect } from "react";
import "css/Media.css";
import { useState } from "react";
import DeviceButton from "./DeviceButton";

const AudioDeviceList: React.FC<{
  selectDevice: (deviceInfo: MediaDeviceInfo) => any;
}> = ({ selectDevice }) => {
  const [selectId, setSelectId] = useState<string>();
  const [deviceInfoArray, setDeviceInfoArray] = useState<MediaDeviceInfo[]>([]);

  const handleSelectDevice = (deviceInfo: MediaDeviceInfo) => {
    setSelectId(deviceInfo.deviceId);
    selectDevice(deviceInfo);
  };

  const getDeviceButtons = (devices: MediaDeviceInfo[]): JSX.Element[] => {
    return devices
      .filter((currentDevice) => {
        if (currentDevice.kind === "audioinput") {
          return currentDevice;
        }
        return null;
      })
      .map((validDevice, index) => {
        let deviceInfo = validDevice;
        let isSelected = selectId === deviceInfo.deviceId ? true : false;
        return (
          <DeviceButton
            key={index}
            deviceInfo={deviceInfo}
            isSelected={isSelected}
            selectDevice={handleSelectDevice}
          />
        );
      });
  };

  const handleSuccess = (devices: MediaDeviceInfo[]) => {
    setDeviceInfoArray(devices);
  };

  useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then(handleSuccess)
      .catch((err) => console.log(err));
  }, []);

  const buttonObjects = getDeviceButtons(deviceInfoArray);
  return <div className="device-list">{buttonObjects}</div>;
};

export default AudioDeviceList;
