export const toCML = (programData, loopData, isNyuryokuShingou, tkData, settings) => {

    let containsShuturyoku1 = false
    let containsShuturyoku2 = false
    let containsShuturyoku3 = false

    let output = ""
    let every_data_teigi = ""
    let every_program_teigi = ""
    for (let dousa_group of programData) {
        let dousa_group_index = programData.indexOf(dousa_group) + 1
        every_program_teigi += "B" + dousa_group_index.toString() + ".1\r\n"
        let dousa_jikkou_of_group = ""
        for (let dousa_row of dousa_group) {
            let dousa_jikkou_row_arr = []
            for (let dousa of dousa_row) {
                if (dousa.length !== 0) {
                    const dousa_jiku = dousa_row.indexOf(dousa) + 1
                    let cml_numbers = dousa[1].toString() + "." + dousa_jiku.toString()
                    const tanniValue = tkData[dousa_jiku-1].tanniValue
                    switch (dousa[0]) {
                        case "位置決め":
                            every_data_teigi += "S"+cml_numbers+"="+getPulseValue(dousa[2][0], tanniValue,100).toString()+"\r\nA"+cml_numbers+"="+getPulseValue(dousa[2][1], tanniValue,1000).toString()+"\r\nP"+cml_numbers+"="+getPulseValue(dousa[2][2], tanniValue).toString()+`\r\n`
                            dousa_jikkou_row_arr.push(`S${cml_numbers},A${cml_numbers},P${cml_numbers}`)
                            break
                        case "位置決め+":
                            every_data_teigi += "S"+cml_numbers+"="+getPulseValue(dousa[2][0], tanniValue,100).toString()+"\r\nA"+cml_numbers+"="+getPulseValue(dousa[2][1], tanniValue,1000).toString()+"\r\nP"+cml_numbers+"="+getPulseValue(dousa[2][2], tanniValue).toString()+`\r\n`
                            dousa_jikkou_row_arr.push(`S${cml_numbers},A${cml_numbers},P${cml_numbers}+`)
                            break
                        case "押付け":
                            every_data_teigi += "S"+cml_numbers+"="+getPulseValue(dousa[2][0], tanniValue,100).toString()+"\r\nA"+cml_numbers+"="+getPulseValue(dousa[2][1], tanniValue,1000).toString()+"\r\nP"+cml_numbers+"="+getPulseValue(dousa[2][2], tanniValue).toString()+"\r\n"
                            dousa_jikkou_row_arr.push(`S${cml_numbers},A${cml_numbers},Q${cml_numbers}`)
                            break
                        case "押付け+":
                            every_data_teigi += "S"+cml_numbers+"="+getPulseValue(dousa[2][0], tanniValue,100).toString()+"\r\nA"+cml_numbers+"="+getPulseValue(dousa[2][1], tanniValue,1000).toString()+"\r\nP"+cml_numbers+"="+getPulseValue(dousa[2][2], tanniValue).toString()+"\r\n"
                            dousa_jikkou_row_arr.push(`S${cml_numbers},A${cml_numbers},Q${cml_numbers}+`)
                            break
                        case "タイマ":
                            every_data_teigi += "T"+cml_numbers+"="+getPulseValue(dousa[2][0], tanniValue).toString()+"\r\n"
                            dousa_jikkou_row_arr.push(`T${cml_numbers}`)
                            break
                        case "入力点からの実行":
                            isNyuryokuShingou = true
                            break
                        case "出力点1へ出力":
                            if (containsShuturyoku1) {
                                alert('エラー: 表を直してください\n出力点1への出力は1回しか使えません。')
                            } else {
                                every_data_teigi +="F1.1,F2.1,F3.1" + "\r\n"
                                every_data_teigi +="O1.1" + "\r\n"
                                containsShuturyoku1 = true
                            }
                            break  
                        case "出力点2へ出力":
                            if (containsShuturyoku2) {
                                alert('エラー: 表を直してください\n出力点2への出力は1回しか使えません。')
                            } else {
                                every_data_teigi +="F1.1,F2.1,F3.1" + "\r\n"
                                every_data_teigi +="O2.1" + "\r\n"
                                containsShuturyoku2 = true
                            }
                            break
                        case "出力点3へ出力":
                            if (containsShuturyoku3) {
                                alert('エラー: 表を直してください\n出力点3への出力は1回しか使えません。')
                            } else {
                                every_data_teigi +="F1.1,F2.1,F3.1" + "\r\n"
                                every_data_teigi +="O3.1" + "\r\n"
                                containsShuturyoku3 = true
                            }
                            break
                        default:
                            alert('ERROR-表を直してください')
                            break
                    }
                }
            }
            let loop_start = ""
            let loop_end = ""
            for (let loop of loopData) {
                if (loop[0][0] === programData.indexOf(dousa_group).toString() && loop[0][1] === dousa_group.indexOf(dousa_row).toString()) {
                    loop_start = `X${loop[2]}.1\r\n`
                }
                if (loop[1][0] === programData.indexOf(dousa_group).toString() && loop[1][1] === dousa_group.indexOf(dousa_row).toString()) {
                    loop_end = `X.1-\r\n`
                }
            }
            if (dousa_jikkou_row_arr.length >= 1) {
                dousa_jikkou_of_group += loop_start + dousa_jikkou_row_arr.join(",") + "\r\n" + loop_end
            } else {
                dousa_jikkou_of_group += loop_start + loop_end
            }
        }
        every_program_teigi += dousa_jikkou_of_group
    }

    let settingsCML = "\r\n"
    const kNumList = [5, 11, 12, 13, 14, 23, 24, 25, 26, 27, 28]
    const jikuNum = programData[0][0].length
    for (let kNum of kNumList) {
        for (let i=1; i<=jikuNum; i++) {
            const value = settings["kNum"+kNum.toString()]
            if (typeof value !== 'string') {
                settingsCML += ("K"+kNum.toString()+"."+i.toString()+"="+value.toString()+"\r\n")
            } else {
                settingsCML += ("K"+kNum.toString()+"."+i.toString()+"="+value+"\r\n")
            }
        }
    }
    
    output += every_data_teigi
    output += every_program_teigi
    // if (isNyuryokuShingou) {
    //     let nyuryokuTxt = `\r\nK81=1\r\nK82=1\r\nL1.1\r\nI1.1,JL2.1,T0.1\r\nI2.1,JL3.1,T0.1\r\nI3.1,JL4.1,T0.1\r\nI4.1,].1:].1,T0.1\r\nL2.1\r\n[1.1\r\nI1.1,W0.1,JL1.1\r\nL3.1\r\n[2.1\r\nI2.1,W0.1,JL1.1\r\nL4.1\r\n[3.1\r\nI3.1,W0.1,JL1.1\r\nEND`
    //     return output + "END" + settingsCML + nyuryokuTxt
    // } else {
    //     return output + "END" + settingsCML
    // }
    let nyuryokuTxt = `K2=0\r\nK3=1\r\nK4=0\r\nK7=0\r\nK30=0\r\nK43=0000\r\nK44=0\r\nK45=0\r\nK46=0\r\nK53=000\r\nK55=0\r\nK56=0\r\nK57=0\r\nK65=0\r\nK71=0\r\nK74=0\r\nK81=1\r\nK82=1\r\nL1.1\r\nI1.1,JL2.1,T0.1\r\nI2.1,JL3.1,T0.1\r\nI3.1,JL4.1,T0.1\r\nI4.1,].1:].1,T0.1\r\nL2.1\r\n[1.1\r\nI1.1,W0.1,JL1.1\r\nL3.1\r\n[2.1\r\nI2.1,W0.1,JL1.1\r\nL4.1\r\n[3.1\r\nI3.1,W0.1,JL1.1\r\nEND`
    // let nyuryokuTxt = `\r\nK81=1\r\nK82=1\r\nL1.1\r\nI1.1,JL2.1,T0.1\r\nI2.1,JL3.1,T0.1\r\nI3.1,JL4.1,T0.1\r\nI4.1,].1:].1,T0.1\r\nL2.1\r\n[1.1\r\nI1.1,W0.1,JL1.1\r\nL3.1\r\n[2.1\r\nI2.1,W0.1,JL1.1\r\nL4.1\r\n[3.1\r\nI3.1,W0.1,JL1.1\r\nEND`
    return output + "END" + settingsCML + nyuryokuTxt
}

const getPulseValue = (valueArr, tanniValue, divideVar=1) => {
    let value = parseFloat(valueArr[0])
    const tanni = valueArr[1]
    if (tanni.includes("pps") || tanni.includes("%") || tanni.includes('msec')) {
        return Math.round(value)
    } else {
        return Math.round(value * tanniValue / divideVar)
    }
}