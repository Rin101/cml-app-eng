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
    // const writer = port.writable.getWriter();
    // await writer.write(str2ab('S.1=100\r\n'));
    // await writer.write(str2ab('A.1=100\r\n'));
    // await writer.write(str2ab('P.1=100000\r\n'));
    // await writer.write(str2ab('^.1\r\n'));
    // // ==============
    // // await writer.write(str2ab('P.1=0\r\n'));
    // // await writer.write(str2ab('^.1\r\n'));
    // writer.releaseLock();
    // await port.close();


    // cml = "S1.1=100\nA1.1=100\nP1.1=100000\nB1.1\nS1.1,A1.1,P1.1"
    // cml = "S1.1=100\nA1.1=100\nP1.1=100000\nB1.1\nS1.1,A1.1,P1.1\nEND"
    let cmlChunkList = cml.split('\n')

    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 38400 });
    const writer = port.writable.getWriter();
    for (let cmlChunk of cmlChunkList) {
        if (cmlChunk.length > 0) {
            await writer.write(str2ab(cmlChunk + '\r\n'));
            console.log(cmlChunk + '\r\n')
        }
    }
    // await writer.write(str2ab('END\r\n'));
    await writer.write(str2ab('[1.1' + '\r\n'));
    console.log('[1.1\r\n');
    // await writer.write(str2ab('^.1\r\n'));
    writer.releaseLock();
    await port.close();
}

export async function send () {
    // const port = await navigator.serial.requestPort();
    // await port.open({ baudRate: 38400 });
    // const writer = port.writable.getWriter();
    // await writer.write(str2ab('S.1=100\r\n'));
    // await writer.write(str2ab('A.1=100\r\n'));
    // await writer.write(str2ab('P.1=100000\r\n'));
    // await writer.write(str2ab('^.1\r\n'));
    // // ==============
    // // await writer.write(str2ab('P.1=0\r\n'));
    // // await writer.write(str2ab('^.1\r\n'));
    // writer.releaseLock();
    // await port.close();


    // cml = "S1.1=100\nA1.1=100\nP1.1=100000\nB1.1\nS1.1,A1.1,P1.1"
    // cml = "S1.1=100\nA1.1=100\nP1.1=100000\nB1.1\nS1.1,A1.1,P1.1\nEND"

    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 38400 });
    const writer = port.writable.getWriter();
    // for (let cmlChunk of cmlChunkList) {
    //     if (cmlChunk.length > 0) {
    //         await writer.write(str2ab(cmlChunk + '\r\n'));
    //         console.log(cmlChunk + '\r\n')
    //     }
    // }
    // await writer.write(str2ab('END\r\n'));
    await writer.write(str2ab('[1.1' + '\r\n'));
    console.log('[1.1\r\n');
    // await writer.write(str2ab('^.1\r\n'));
    writer.releaseLock();
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