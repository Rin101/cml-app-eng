import { Button } from "@mui/material"
import { useEffect, useRef, useState } from "react"

// ------------------------------------
export const WizardJiku = (props) => {

    const params = props.params
    const tkData = params.tannikannsannData
    const [input, setInput] = useState(params.history.length >= 1 ? params.history[0][1] : [])
    const checkBoxRef = useRef()

    useEffect(() => {
        input.forEach(num => {
            checkBoxRef.current.querySelector('#jiku-'+num).checked = true
        })
    }, [input])

    const jikuCheckBoxContainer = () => {
        let res = []
        let i = 1
        while (i<=params.jiku) {
            const num = i
            res.push(
                <div className="jiku-input-container" key={num+"jiku-input"}>
                    <input type="checkbox" key={num+"input"} onChange={(e) => changeInput(e, num)} id={"jiku-"+num} name="jiku-sentaku"/>
                    <label htmlFor={"jiku-"+num} key={num+"label"}>{num}軸目</label>
                </div>
            )
            i += 1
        }
        return res
    }

    const changeInput = (e, num) => {
        const isChecked = e.currentTarget.checked
        let tmp = [...input]
        if (isChecked && !input.includes(num)) {
            tmp.push(num)
        } else {
            const index = tmp.indexOf(num);
            if (index > -1) {
                tmp.splice(index, 1);
            }
        }
        setInput(tmp)
    }

    const goNext = () => {
        let isCheckedArr = []
        checkBoxRef.current.querySelectorAll('input').forEach(checkBox => {
            if (checkBox.checked === true) {
                isCheckedArr.push("true")
            }
        })
        if (isCheckedArr.length >= 1) {
            let tmp = [...params.history]
            if (tmp.length >= 1) {
                tmp[0][1] = input
            } else {
                tmp.push(["jiku", input])
            }
            params.setHistory(tmp)
            params.setWizardInput(["kikou", input])
        } else {
            alert("軸を選択してください")
        }
    }

    return (
        <div className="tanni-wizard unselectable">
            <p className="tanni-wizard-title">軸の選択</p>
            <div ref={checkBoxRef} className="tanni-wizard-selector tanni-jiku">
                {jikuCheckBoxContainer()}
            </div>
            <div className="tanni-wizard-buttons">
                <Button className="tanni-next" variant="contained" onClick={() => goNext()}>NEXT</Button>
            </div>
        </div>
    )
}
// ------------------------------------

export const WizardKikou = (props) => {
    const params = props.params
    const tkData = params.tannikannsannData
    const jikuMainNum = params.history[0][1][0]-1
    const [input, setInput] = useState(params.history.length >= 2 ? params.history[1][1] : (tkData[jikuMainNum].kikou !== "initial" ? tkData[jikuMainNum].kikou : "ボールねじ"))
    const radioRef = useRef()

    useEffect(() => {
        let arr = ["ボールねじ", "ベルト駆動", "ラックアンドピニオン", "インデックステーブル"]
        let i = arr.indexOf(input) + 1
        radioRef.current.querySelector('#kikou-'+i).checked = true
    }, [input])

    const goBack = () => {
        params.setWizardInput(["jiku", params.history[0][1]])
    }

    const goNext = () => {
        let isCheckedArr = []
        radioRef.current.querySelectorAll('input').forEach(input => {
            if (input.checked === true) {
                isCheckedArr.push("true")
            }
        })
        if (isCheckedArr.length !== 1) {
            alert('機構を選択してください')
        } else {
            let tmp = [...params.history]
            if (params.history.length === 1) {
                tmp.push(["kikou", input])
                if (input !== "インデックステーブル") {
                    params.setWizardInput(["susumiryou", input])
                } else {
                    tmp.push(["susumiryou", 360, 360])
                    params.setWizardInput(["gensoku", input])
                }
            } else {
                tmp[1] = ["kikou", input]
                if (input !== "インデックステーブル") {
                    params.setWizardInput(["susumiryou", input])
                } else {
                    tmp[2] = ["susumiryou", 1]
                    params.setWizardInput(["gensoku", input])
                }
            }
            params.setHistory(tmp)
        }
    }

    return (
        <div className="tanni-wizard unselectable">
            <p className="tanni-wizard-title">機構の選択</p>
            <div ref={radioRef} className="tanni-wizard-selector tanni-kikou">
                <div>
                    <input type="radio" onClick={(e) => setInput(e.currentTarget.value)} id="kikou-1" name="kikou-sentaku" value="ボールねじ"/>
                    <label htmlFor="kikou-1">ボールねじ</label>
                </div>
                <div>
                    <input type="radio" onClick={(e) => setInput(e.currentTarget.value)} id="kikou-2" name="kikou-sentaku" value="ベルト駆動" />
                    <label htmlFor="kikou-2">ベルト駆動</label>
                </div>
                <div>
                    <input type="radio" onClick={(e) => setInput(e.currentTarget.value)} id="kikou-3" name="kikou-sentaku" value="ラックアンドピニオン" />
                    <label htmlFor="kikou-3">ラックアンドピニオン</label>
                </div>
                <div>
                    <input type="radio" onClick={(e) => setInput(e.currentTarget.value)} id="kikou-4" name="kikou-sentaku" value="インデックステーブル" />
                    <label htmlFor="kikou-4">インデックステーブル</label>
                </div>
            </div>
            <div className="tanni-wizard-buttons">
                <Button className="tanni-back" variant="contained" onClick={() => goBack()}>BACK</Button>
                <Button className="tanni-next" variant="contained" onClick={() => goNext()}>NEXT</Button>
            </div>
        </div>
    )
}

export const WizardSusumiryou = (props) => {
    const params = props.params
    const tkData = params.tannikannsannData
    const jikuMainNum = params.history[0][1][0]-1
    const mode = params.history[1][1]
    let susumiryouText = ""
    let susumiryouVar = Math.PI
    const [input, setInput] = useState((params.history.length >= 3) ? parseFloat(params.history[2][2]) : tkData[jikuMainNum].susumiryou[0])

    switch (mode) {
        case "ボールねじ":
            susumiryouText = "ボールねじリード"
            susumiryouVar = 1
            break
        case "ベルト駆動":
            susumiryouText = "プーリ直径"
            break
        case "ラックアンドピニオン":
            susumiryouText = "ピニオン直径"
            break
        default:
            susumiryouText = "ボールねじリード"
            break
    }

    const goNext = () => {
        if (input !== "") {
            let tmp = [...params.history]
            if (params.history.length === 2) {
                tmp.push(["susumiryou", Math.round((parseFloat(input)*susumiryouVar + Number.EPSILON) * 100) / 100, parseFloat(input)])
            } else {
                tmp[2] = ["susumiryou", Math.round((parseFloat(input)*susumiryouVar + Number.EPSILON) * 100) / 100, parseFloat(input)]
            }
            params.setHistory(tmp)
            params.setWizardInput(["gensoku", input])
        } else {
            alert('数値を入力してください')
        }
    }

    const goBack = () => {
        let tmp = [...params.history]
        let kikouValue = tmp[1][1]
        params.setWizardInput(["kikou", kikouValue])
    }

    return (
        <div className="tanni-wizard">
            <p className="tanni-wizard-title unselectable">モータ1回転あたりの進み量</p>
            <div className="tanni-wizard-selector tanni-susumi">
                <div className="susumi-1">
                    <p className='tanni-susumi-p'>{susumiryouText} : </p>
                    {(params.history.length <= 2 && tkData[jikuMainNum].susumiryou[0]===0) ? 
                    <input type="text" placeholder={0} onChange={(e) => setInput(e.currentTarget.value)}/>
                    : <input type="text" value={input} onChange={(e) => setInput(e.currentTarget.value)}/>
                    }
                    <p className='tanni-susumi-tanni'> mm</p>
                </div>
                <div className="susumi-2">
                    <p className='tanni-susumi-p'>進み量 : <span>{Math.round((parseFloat(input)*susumiryouVar + Number.EPSILON) * 100) / 100}</span> mm</p>
                </div>
            </div>
            <div className="tanni-wizard-buttons unselectable">
                <Button className="tanni-back" variant="contained" onClick={() => goBack()}>BACK</Button>
                <Button className="tanni-next" variant="contained" onClick={() => goNext()}>NEXT</Button>
            </div>
        </div>
    )
}

export const WizardGensoku = (props) => {
    const params = props.params
    const tkData = params.tannikannsannData
    const jikuMainNum = params.history[0][1][0]-1
    // const [input, setInput] = useState((params.history.length >= 4) ? params.history[3][1] : tkData[jikuMainNum].gensoku)
    const [input1, setInput1] = useState((params.history.length >= 4) ? params.history[3][1][0] : tkData[jikuMainNum].gensoku[0])
    const [input2, setInput2] = useState((params.history.length >= 4) ? params.history[3][1][1] : tkData[jikuMainNum].gensoku[1])
    const checkBoxRef = useRef()
    const selectorRef = useRef()

    useEffect(() => {
        if (((params.history.length > 3) && (params.history[3][1][0] !== (1||"") || params.history[3][1][1] !== (1||""))) || (tkData[jikuMainNum].gensoku[0]!==(1||"") || tkData[jikuMainNum].gensoku[1]!==(1||""))) {
            selectorRef.current.style.opacity = "1"
            checkBoxRef.current.checked = "true"
            selectorRef.current.querySelectorAll("input").forEach(input => {
                input.readOnly = false
            })
        }
    })

    const goNext = () => {
        if ((input1 && input2) !== "") {
            let tmp = [...params.history]
            if (params.history.length === 3) {
                tmp.push(["gensoku", [input1, input2]])
            } else {
                tmp[3] = ["gensoku", [input1, input2]]
            }
            params.setHistory(tmp)
            params.setWizardInput(["bunkai", [input1, input2]])
        } else {
            alert("数値を入力してください")
        }
    }

    const goBack = () => {
        if (params.history[1][1] !== "インデックステーブル") {
            params.setWizardInput(["susumiryou", 0])
        } else {
            params.setWizardInput(["kikou", 0])
        }
    }

    const handleToggle = (e) => {
        if (e.currentTarget.checked) {
            selectorRef.current.style.opacity = "1"
            selectorRef.current.querySelectorAll("input").forEach(input => {
                input.readOnly = false
            })
        } else {
            setInput1(1)
            setInput2(1)
            selectorRef.current.style.opacity = "0.4"
        }
    }

    return (
        <div className="tanni-wizard unselectable">
            <div className="tanni-wizard-title gensoku-title"><input ref={checkBoxRef} type="checkbox" onChange={(e) => handleToggle(e)} />減速比率</div>
            <div ref={selectorRef} className="tanni-wizard-selector gensoku-selector">
                <table>
                    <thead>
                        <tr>
                            <th>入力</th>
                            <th></th>
                            <th>出力</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><input type="text" readOnly value={input1} onChange={(e) => setInput1(e.currentTarget.value)}/></td>
                            <td>  :  </td>
                            <td><input type="text" readOnly value={input2} onChange={(e) => setInput2(e.currentTarget.value)}/></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="tanni-wizard-buttons">
                <Button className="tanni-back" variant="contained" onClick={() => goBack()}>BACK</Button>
                <Button className="tanni-next" variant="contained" onClick={() => goNext()}>NEXT</Button>
            </div>
        </div>
    )
}

export const WizardBunkai = (props) => {
    const params = props.params
    const tkData = params.tannikannsannData
    const jikuMainNum = params.history[0][1][0]-1
    const mode = params.history[1][1]
    let bunkaiText = ""
    let bunkaiVar = 1
    const [input, setInput] = useState(params.history.length === 5 ? params.history[4][1] : tkData[jikuMainNum].bunkai)

    switch (mode) {
        case "インデックステーブル":
            bunkaiText = "°"
            bunkaiVar = 360 / (params.history[3][1][1]/params.history[3][1][0])
            break
        default:
            bunkaiText = "mm"
            bunkaiVar = params.history[2][1] / (params.history[3][1][1]/params.history[3][1][0])
            break
    }

    const getTanniValue = () => {
        return (1/parseFloat(params.history[2][1])) * parseFloat(input) * (parseFloat(params.history[3][1][1])/parseFloat(params.history[3][1][0]))
    }

    const goOK = () => {
        let tkTmp = [...tkData]
        params.history[0][1].forEach(jikuNum => {
            tkTmp[jikuNum-1] = {kikou:params.history[1][1],susumiryou:[params.history[2][1],params.history[2][2]],gensoku:params.history[3][1],bunkai:input,tanniValue:getTanniValue()}
        })
        params.setTannikannsannData(tkTmp)
        params.setHistory([])
        props.close()
    }

    const goBack = () => {
        params.setWizardInput(["gensoku", 0])
    }

    const changeInput = (item) => {
        setInput(item)
        let tmp = [...params.history]
        if (tmp.length < 5) {
            tmp.push(["bunkai", item])
        } else {
            tmp[4] = ["bunkai", item]
        }
        params.setHistory(tmp)
    }

    // decimal point function
    function roundTo(n, digits) {
        var negative = false;
        if (digits === undefined) {
            digits = 0;
        }
        if (n < 0) {
            negative = true;
            n = n * -1;
        }
        var multiplicator = Math.pow(10, digits);
        n = parseFloat((n * multiplicator).toFixed(11));
        n = (Math.round(n) / multiplicator).toFixed(digits);
        if (negative) {
            n = (n * -1).toFixed(digits);
        }
        return n;
    }

    return (
        <div className="tanni-wizard unselectable">
            <p className="tanni-wizard-title">最小位置決め単位</p>
            <div className="tanni-wizard-selector tanni-bunkai">
                <div className="bunkai-1">
                    <p className="tanni-bunkai-text">モータ分解能: </p>
                    <Dropdown setItem={changeInput} defaultItem={input} itemArr={[300, 600, 1000, 1200, 2000, 3000, 5000, 6000, 10000, 12000]} />
                    <p className="tanni-bunkai-text">パルス/回転</p>
                </div>
                <div className="bunkai-2">
                    <p className="tanni-bunkai-text">最小位置決め単位: <span>{roundTo(bunkaiVar/parseFloat(input) + Number.EPSILON, 5)}</span> {bunkaiText}</p>
                </div>
            </div>
            <div className="tanni-wizard-buttons">
                <Button className="tanni-back" variant="contained" onClick={() => goBack()}>BACK</Button>
                <Button className="tanni-ok" variant="contained" onClick={() => goOK()}>OK</Button>
            </div>
        </div>
    )
}

const Dropdown = (props) => {
    const itemArr = props.itemArr
    const setItem = props.setItem

    const [selectedItem, setSelectedItem] = useState(props.defaultItem !== undefined ? props.defaultItem : itemArr[0])
    const dropdownItems = useRef()
    const selectedItemRef = useRef()

    const dropdowns = () => {
        return itemArr.map(item => {
            return (
                <div className="dropdown-item unselectable" onClick={(e) => clickItem(e)} key={item}>{item}</div>
            )
        })
    }

    const showItems = () => {
        dropdownItems.current.style.display = "block"
    }
    
    const clickItem = (e) => {
        setSelectedItem(e.target.innerText)
        setItem(e.target.innerText)
        dropdownItems.current.style.display = "none"
    }


    return (
        <div className="dropdown-selector">
            <div ref={selectedItemRef} className="selected-item unselectable" onClick={() => showItems()}>{selectedItem}<i className="fas fa-angle-down"></i></div>
            <div ref={dropdownItems} className="dropdown-items unselectable">
                {dropdowns()}
            </div>
        </div>
    )
}