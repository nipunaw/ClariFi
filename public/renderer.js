async function testIt() {
	const filters = [
		{ usbVendorId: 0x0403, usbProductId: 0x6010 } // FPGA
	];
	
	//const port = await navigator.serial.requestPort({filters});
	const ports = await navigator.serial.getPorts();
	await ports[0].open({ baudRate: 9600 });
	
	const writer = ports[0].writable.getWriter();
	const data = new Uint8Array([104, 101, 108, 108, 111]); // hello
	await writer.write(data);
	writer.releaseLock();
	
	await ports[0].close();

}

navigator.serial.addEventListener("connect", (event) => {
  console.log("Device connected");
});

navigator.serial.addEventListener("disconnect", (event) => {
  console.log("Device disconnected");
});