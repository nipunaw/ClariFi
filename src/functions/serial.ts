export async function writeSerial(data : Uint8Array) {
	let navigator: any = window.navigator;
    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 115200 });
    
    const writer = port.writable.getWriter();
    await writer.write(data);
    writer.releaseLock();
    
    await port.close();
}

const accessPort = () => {
  let navigator: any = window.navigator;
  navigator.serial
    .requestPort()
    .then((port: any) => {
      port.open({ baudRate: 115200 });
      return port;
    })
    .catch((err: Error) => {
      console.error(err);
    });
  return undefined;
};

export const writeSerial_WIP = (data: Uint8Array) => {
  const port = accessPort() as any;
  if (port) {
    const writer = port.writable.getWriter();
    writer
      .write(data)
      .then(() => {
        writer.releaseLock();
      })
      .then(() => {
        port.close();
      })
      .catch((err: Error) => {
        console.error(err);
      });
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
