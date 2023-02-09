function str2ab(str) {
    var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

export async function pressRun (cml) {
    // const port = await navigator.serial.requestPort();
    // await port.open({ baudRate: 38400 });
    // let writer = await port.writable.getWriter();
    // await writer.write(str2ab('S.1=100\r\n'));
    // await writer.releaseLock();
    // writer = await port.writable.getWriter();
    // await writer.write(str2ab('A.1=100\r\n'));
    // await writer.releaseLock();
    // writer = await port.writable.getWriter();
    // await writer.write(str2ab('P.1=100000\r\n'));
    // await writer.releaseLock();
    // writer = await port.writable.getWriter();
    // await writer.write(str2ab('^.1\r\n'));
    // await writer.releaseLock();
    // // ==============
    // // await writer.write(str2ab('P.1=0\r\n'));
    // // await writer.write(str2ab('^.1\r\n'));
    // // await writer.releaseLock();
    // await port.close();

    let cmlChunkList = cml.split('\n')
    
    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 38400 });
    for (let cmlChunk of cmlChunkList) {
        let editedCmlChunk = cmlChunk.replace(/[\n\r]+/g, '');
        editedCmlChunk = editedCmlChunk.replace(/\s+/g, '');
        if (editedCmlChunk.length > 0) {
            const writer = await port.writable.getWriter();
            await writer.write(str2ab(editedCmlChunk + '\r\n'));
            await writer.releaseLock();
        }
    }
    // const writer = await port.writable.getWriter();
    // await writer.write(str2ab('[1.1\r\n'));
    // await writer.releaseLock();
    await port.close();
}

export async function send () {

    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 38400 });
    const writer = await port.writable.getWriter();
    await writer.write(str2ab('[1.1' + '\r\n'));
    // console.log('[1.1\r\n');
    await writer.releaseLock();
    await port.close();
}

export async function stop() {
    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 38400 });
    const writer = port.writable.getWriter();
    // await writer.write(str2ab('].1' + '\r\n'));
    // await writer.write(str2ab(']L' + '\r\n'));
    await writer.write(str2ab('L1.1' + '\r\n'));
    await writer.write(str2ab('END' + '\r\n'));
    await writer.write(str2ab('$.1' + '\r\n'));
    writer.releaseLock();
    await port.close();
}
