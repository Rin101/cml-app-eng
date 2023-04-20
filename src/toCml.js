export const toCML = (programData, loopData, isNyuryokuShingou, tkData, settings) => {

    let containsShuturyoku1 = false
    let containsShuturyoku2 = false
    let containsShuturyoku3 = false
    let containsShuturyokuOff = false

    let output = ""
    let every_data_teigi = ""
    let every_program_teigi = ""
    for (let dousa_group of programData) {
        let dousa_group_index = programData.indexOf(dousa_group) + 1
        every_program_teigi += "B" + dousa_group_index.toString() + ".1\r\n"
        let dousa_jikkou_of_group = ""
        for (let dousa_row of dousa_group) {
            let dousa_jikkou_row_arr = []
            let shuturyoku_row = ""
            let gentenfukki = ""
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
                            shuturyoku_row += "O1.1\r\n"
                            containsShuturyoku1 = true
                            // if (!containsShuturyoku1) {
                            //     shuturyoku_row += "O1.1\r\n"
                            //     containsShuturyoku1 = true
                            // } else {
                            //     alert('エラー: 表を直してください\n出力点1への出力は1回しか使えません。')
                            // }
                            break  
                        case "出力点2へ出力":
                            shuturyoku_row += "O2.1\r\n"
                            containsShuturyoku2 = true
                            // if (!containsShuturyoku2) {
                            //     shuturyoku_row += "O2.1\r\n"
                            //     containsShuturyoku2 = true
                            // } else {
                            //     alert('エラー: 表を直してください\n出力点2への出力は1回しか使えません。')
                            // }
                            break
                        case "出力点3へ出力":
                            shuturyoku_row += "O3.1\r\n"
                            containsShuturyoku3 = true
                            // if (!containsShuturyoku3) {
                            //     shuturyoku_row += "O3.1\r\n"
                            //     containsShuturyoku3 = true
                            // } else {
                            //     alert('エラー: 表を直してください\n出力点3への出力は1回しか使えません。')
                            // }
                            break
                        case "出力点を全てOFF":
                            every_program_teigi += "F1.1,F2.1,F3.1\r\n"
                            containsShuturyokuOff = true
                            // if (!containsShuturyokuOff) {
                            //     every_program_teigi += "F1.1,F2.1,F3.1\r\n"
                            //     containsShuturyokuOff = true
                            // } else {
                            //     alert('エラー: 表を直してください\n出力点を全てOFFは1回しか使えません。')
                            // }
                            break   
                        case "原点復帰":
                            gentenfukki += "|." + dousa_jiku.toString() + "\r\n"
                            console.log("hi")
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
                dousa_jikkou_of_group += loop_start + dousa_jikkou_row_arr.join(",") + "\r\n" + shuturyoku_row + gentenfukki + loop_end
            } else {
                dousa_jikkou_of_group += loop_start + shuturyoku_row + gentenfukki + loop_end
            }
        }
        every_program_teigi += dousa_jikkou_of_group
    }

    let settingsCML = "\r\n"
    const jikuNum = programData[0][0].length

    // 分解能のK値設定
    const bunkainouValueList = [300, 600, 1000, 1200, 2000, 3000, 5000, 6000, 10000, 12000]
    let bunkainouCML = 0
    if ((typeof tkData[0]["bunkai"]) === "string") {
        bunkainouCML = bunkainouValueList.indexOf(parseInt(tkData[0]["bunkai"])).toString()
    } else {
        bunkainouCML = bunkainouValueList.indexOf(tkData[0]["bunkai"]).toString()
    }
    for (let i=1; i<=jikuNum; i++) {
        settingsCML += ("K1."+i.toString()+"="+bunkainouCML+"\r\n")
    }


    const allKNumList = [
        2, 3, 4, 5, 7, 11, 12, 13, 14, 22, 23, 24, 25, 26, 27, 28, 30, 43, 44, 45, 46, 47, 53, 55, 56, 57, 65, 71, 74, 81, 82
    ]

    // 設定のK値設定
    const kNumList = [5, 11, 12, 13, 14, 22, 23, 24, 25, 26, 28]
    // 毎回設定されるK値
    const constantKNumList = [[2, "0"], [3, "1"], [4, "0"], [7, "0"], [27, "0"], [30, "0"], [43, "0000"], [44, "0"], [45, "0"], [46, "0"], [47, "0"], [53, "111"], [55, "0"], [56, "0"], [57, "0"], [65, "0"], [71, "0"], [74, "0"], [81, "1"], [82, "1"]]
    

    for (let kNum of allKNumList) {
        if (kNumList.includes(kNum)) {
            for (let i=1; i<=jikuNum; i++) {
                const value = settings["kNum"+kNum.toString()]
                if (typeof value !== 'string') {
                    settingsCML += ("K"+kNum.toString()+"."+i.toString()+"="+value.toString()+"\r\n")
                } else {
                    settingsCML += ("K"+kNum.toString()+"."+i.toString()+"="+value+"\r\n")
                }
            }
        } else {
            for (let itemInConstants of constantKNumList) {
                if (itemInConstants[0] === kNum) {
                    for (let i=1; i<=jikuNum; i++) {
                        settingsCML += ("K"+itemInConstants[0].toString()+"."+i.toString()+"="+itemInConstants[1]+"\r\n")
                    }
                    break
                }
            }
        }
    }

    
    output += every_data_teigi
    output += every_program_teigi
    // if (isNyuryokuShingou) {
    //     let nyuryokuTxt = `\r\nK81=1\r\nK82=1\r\nL1.1\r\nI1.1,JL2.1,T0.1\r\nI2.1,JL3.1,T0.1\r\nI3.1,JL4.1,T0.1\r\nI4.1,].1:].1,T0.1\r\nL2.1\r\n[1.1\r\nI1.1,W0.1,JL1.1\r\nL3.1\r\n[2.1\r\nI2.1,W0.1,JL1.1\r\nL4.1\r\n[3.1\r\nI3.1,W0.1,JL1.1\r\nEND.1`
    //     return output + "END.1" + settingsCML + nyuryokuTxt
    // } else {
    //     return output + "END.1" + settingsCML
    // }
    let nyuryokuTxt = `L1.1\r\nI1.1,JL2.1,T0.1\r\nI2.1,JL3.1,T0.1\r\nI3.1,JL4.1,T0.1\r\nI4.1,].1:].1,T0.1\r\nL2.1\r\n[1.1\r\nI1.1,W0.1,JL1.1\r\nL3.1\r\n[2.1\r\nI2.1,W0.1,JL1.1\r\nL4.1\r\n[3.1\r\nI3.1,W0.1,JL1.1\r\nEND.1\r\n`
    // let nyuryokuTxt = `\r\nK81=1\r\nK82=1\r\nL1.1\r\nI1.1,JL2.1,T0.1\r\nI2.1,JL3.1,T0.1\r\nI3.1,JL4.1,T0.1\r\nI4.1,].1:].1,T0.1\r\nL2.1\r\n[1.1\r\nI1.1,W0.1,JL1.1\r\nL3.1\r\n[2.1\r\nI2.1,W0.1,JL1.1\r\nL4.1\r\n[3.1\r\nI3.1,W0.1,JL1.1\r\nEND.1`
    return output + "END.1\r\n" + nyuryokuTxt + "\\" + "\r\n" + settingsCML + "\r\n$." + "\r\n"
    // return output + "END.1\r\n" + nyuryokuTxt + "\\" + "\r\n$.\r\n" + settingsCML + "\r\n"
}

const getPulseValue = (valueArr, tanniValue, divideVar=1) => {
    let value = parseFloat(valueArr[0])
    const tanni = valueArr[1]
    if (tanni.includes("pps") || tanni.includes("%") || tanni.includes('msec') || tanni.includes('Pulse')) {
        return Math.round(value)
    } else {
        return Math.round(value * tanniValue / divideVar)
    }
}
