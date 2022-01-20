const DeviceButton: React.FC<{
  isSelected: boolean;
  deviceInfo: MediaDeviceInfo;
  selectDevice: (deviceInfo: MediaDeviceInfo) => any;
}> = ({ isSelected, deviceInfo, selectDevice }) => {
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    selectDevice(deviceInfo);
  };

  const classStyle = isSelected
    ? "device-btn device-btn-selected"
    : "device-btn";

  return (
    <div className={classStyle} onClick={handleClick}>
      {deviceInfo.label}
    </div>
  );
};

export default DeviceButton;
