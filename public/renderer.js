async function testIt() {
	const filters = [
		{ usbVendorId: 0x0403, usbProductId: 0x6010 }, // FPGA
		{ usbVendorId: 0x005d, usbProductId: 0x223b }
	];
	
	const port = await navigator.serial.requestPort(filters);
	await port.open({ baudRate: 9600 });
	
	const writer = port.writable.getWriter();
	const data = new Uint8Array([104, 101, 108, 108, 111]); // hello
	await writer.write(data);
	writer.releaseLock();
	
	await port.close();

}

navigator.serial.addEventListener("connect", (event) => {
  console.log("Device connected");
});

navigator.serial.addEventListener("disconnect", (event) => {
  console.log("Device disconnected");
});