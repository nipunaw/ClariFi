const getPort = async () => {
  let navigator: any = window.navigator;
  const port = await navigator.serial.requestPort();
  await port.open({ baudRate: 115200 });
  return port;
};

const writeData = async (port: any, data: Uint8Array): Promise<boolean> => {
  try {
    const writer = port.writable.getWriter();
    writer.write(data);
    await writer.releaseLock();
    await port.close();
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const writeSerial = async (data: Uint8Array): Promise<boolean> => {
  try {
    const port = await getPort();
    const status = await writeData(port, data);
    return status;
  } catch (err) {
    console.error(err);
    return false;
  }
};

/*
  navigator.serial.addEventListener("connect", (event) => {
    console.log("Device connected");
  });
  
  navigator.serial.addEventListener("disconnect", (event) => {
    console.log("Device disconnected");
  });
  
  */
