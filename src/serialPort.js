function str2ab(str) {
    var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

export async function pressRun (cml) {
    let cmlChunkList = cml.split('\n')

    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 38400 });
    const writer = port.writable.getWriter();
    for (let cmlChunk of cmlChunkList) {
        await writer.write(str2ab(cmlChunk + '\r\n'));
    }
    await writer.write(str2ab("[.1" + '\r\n'));
    writer.releaseLock();
    await port.close();
}

export async function stop() {
    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 38400 });
    const writer = port.writable.getWriter();
    await writer.write(str2ab(']L' + '\r\n'));
    await writer.write(str2ab('L1.1' + '\r\n'));
    await writer.write(str2ab('END' + '\r\n'));
    await writer.write(str2ab('$.1' + '\r\n'));
    writer.releaseLock();
    await port.close();
}