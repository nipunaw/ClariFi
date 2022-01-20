async function testIt() {
	const filters = [
		{ usbVendorId: 0x0403, usbProductId: 0x6010 }, // FPGA
		{ usbVendorId: 0x005d, usbProductId: 0x223b }
	];
	
	const port = await navigator.serial.requestPort();

	const reader = port.readable.getReader();
	const { value, done } = await reader.read();
	console.log(value);
	console.log(done);
	reader.releaseLock();

	// Allow the serial port to be closed later.
	//writer.releaseLock();
	
	await port.close();

}
