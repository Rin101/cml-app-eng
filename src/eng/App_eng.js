import { Button } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import '../App.css'
import '../program-grid.css'
import { Editor } from '../Editor';
import { ProgramBlockEng, TypeDataInDousaEng, LoopInputBoxEng } from './programBlock_eng';
import useLocalStorage from '../useLocalStorage';
import { TopMenuEng } from './menu_eng';
import { downloadFile } from '../menu';
import soundfile1 from '../sounds/決定、ボタン押下38.mp3'
import soundfile2 from '../sounds/決定、ボタン押下44.mp3'
import instructionImg from '../image/popup-instruction.png'

export const AppEng = () => {

    const [cmlOutput, setCmlOutput] = useLocalStorage('CML', '')
    const [isNyuryokuShingou, setIsNyuryokuShingou] = useState(false)
    const [settings, setSettings] = useLocalStorage('kNum', {
        'kNum5': 5, 'kNum11': 0, 'kNum12': 30, 'kNum13': 200, 'kNum14': 0, 'kNum22': 0,
        'kNum23': 10, 'kNum24': 10, 'kNum25': 0, 'kNum26': 0, 'kNum27': 0, 'kNum28': 30
    })
    const [isMute, setIsMute] = useState(false)
    const [jiku, setJiku] = useState(1)
    let initialTannikannsannData = []
    for (let i=0; i < jiku; i++) {
        initialTannikannsannData.push({kikou: "initial", susumiryou: [1,1], gensoku: [1,1], bunkai: 300, tanniValue:1})
    }
    const [tannikannsannData, setTannikannsannData] = useState(initialTannikannsannData)
    // const [programData, setProgramData] = useState([[[["位置決め", 1, [[100, "pps"], [100, "pps"], [100, "pps"]]],[],[]],[[],[],[]],[[],[],[]]]])
    const [programData, setProgramData] = useState(
        [
            [
                [["位置決め", 1, [[100, "pps"], [100, "pps"], [100, "pps"]]]],
                [[]],
                [[]]
            ], [[[]]], [[[]]]
        ]
    )
    const [loopData, setLoopData] = useState([])
    const [currentDraggedCommand, setCurrentDraggedCommand] = useState("位置決め")

    // typeDataObj: [jiku, parentId, dousaType, dousaNum, isInitial]
    // loopInputObj: [parentId, isInitial]
    const [typeDataObj, setTypeDataObj] = useState(new Array(5))
    const [loopInputObj, setLoopInputObj] = useState(new Array(2))
    const [inputBoxType, setInputBoxType] = useState("none")

    const typeDataRef = useRef()
    const loopInputRef = useRef()
    const expCopy = useRef()
    const expCopyDone = useRef()
    const layerRef = useRef()
    const commandSelectorRef = useRef()
    const instructionPopupRef = useRef()

    // const getIndex = (document) => {
    //     let res = document.id.split('-')
    //     res.shift()
    //     return res
    // }

    const commandDragStart = (e) => {
        if (!isMute) {
            let audio = new Audio(soundfile1);
            audio.play();
        }
    }

    const commandHover = (e) => {
        switch(e.target.id) {
            case "ichigime-selector":
                setCurrentDraggedCommand("位置決め")
                break
            case "oshituke-selector":
                setCurrentDraggedCommand("押付け")
                break
            case "taima-selector":
                setCurrentDraggedCommand("タイマ")
                break
            case "incremental-ichigime-selector":
                setCurrentDraggedCommand("位置決め+")
                break
            case "incremental-oshituke-selector":
                setCurrentDraggedCommand("押付け+")
                break
            case "nyuryokuten-selector":
                setCurrentDraggedCommand("入力点からの実行")
                break
            case "kurikaeshi-selector":
                setCurrentDraggedCommand("繰り返し")
                break
            case "dousaGroup-selector":
                setCurrentDraggedCommand("動作グループを追加")
                break
            default:
                setCurrentDraggedCommand("NOPE")
                break
        }
        // this.className += ' hold';
        // setTimeout(() => (this.className = 'invisible'), 0);
    }
    // function dragEnd() {
    //     this.className = 'fill';
    // }

    const copyCML = (cml) => {
        navigator.clipboard.writeText(cml);
        expCopy.current.style.display = "none"
        expCopyDone.current.style.display = "block"
        setTimeout(() => {
            expCopyDone.current.style.display = "none"
        }, 2000)
    }

    const display = (ref) => {
        ref.current.classList.add("shown")
        ref.current.classList.remove("hidden")
        setTimeout(() => {
            if (!ref.current.classList.contains("hidden")) {
                ref.current.style.display = "block"
            }
        }, 500)
    }

    const hide = (ref) => {
        ref.current.classList.remove('shown')
        ref.current.classList.add('hidden')
        ref.current.style.display = "none"
    }

    const showPopUpOfInstruction = () => {
        // instructionPopupRef.current.style.display = "flex"
        handleFileExport()
    }

    const handleFileExport = () => {
        const data = cmlOutput
        const filename = "CML-保存"
        const type = ".txt"
        downloadFile(data, filename, type)
    }

    const DataInputBox = (props) => {
        switch (props.inputBoxType) {
            case "typedata":
                return <TypeDataInDousaEng tkData={tannikannsannData} setInputBoxType={setInputBoxType} isInitial={typeDataObj[4]} jiku={typeDataObj[0]} parentId={typeDataObj[1]} dousaType={typeDataObj[2]} dousaNum={typeDataObj[3]} programData={programData} setProgramData={setProgramData}/>
            case "loop":
                return <LoopInputBoxEng setInputBoxType={setInputBoxType} isInitial={loopInputObj[1]} parentId={loopInputObj[0]} loopData={loopData} setLoopData={setLoopData} />
            default:
                return <></>
        }
    }

    const PopUpOfInstruction = () => {
        const close = () => {
            instructionPopupRef.current.style.display = "none"
        }

        return (
            <div className='popup-instruction' ref={instructionPopupRef}>
                <div className='popup-content'>
                    <div id="close-instruction-popup" onClick={() => close()}><i className="fas fa-times-circle"></i></div>
                    <img src={instructionImg} alt="instruction" />
                </div>
                {/* <div className='popup-neveragain'>
                    <p style={{marginRight:10}}>次回から表示しない</p>
                    <input type={'checkbox'} />
                </div> */}
            </div>
        )
    }

    return (
        <div className="main">
            <PopUpOfInstruction />
            <DataInputBox inputBoxType={inputBoxType} />
            <div ref={layerRef} className="layer"></div>
            <div className='top-menu-container'>
                <TopMenuEng settings={settings} setSettings={setSettings} isMute={isMute} setIsMute={setIsMute} tannikannsannData={tannikannsannData} setTannikannsannData={setTannikannsannData} programData={programData} setProgramData={setProgramData} loopData={loopData} setLoopData={setLoopData} layerRef={layerRef} cmlOutput={cmlOutput} setCmlOutput={setCmlOutput} isNyuryokuShingou={isNyuryokuShingou} setIsNyuryokuShingou={setIsNyuryokuShingou} jiku={jiku} setJiku={setJiku}/>
            </div>
            <div className="center-section">
                <div className="command-list-width-box"></div>
                <div className='command-list-container'>
                    <div className="command-list">
                        <div className='command-list-wrapper'>
                            {/* <div onMouseEnter={(e) => commandHover(e)} className="command-selector" id="dousaGroup-selector" draggable="true"><i className="fas fa-grip-vertical"></i>Add Motion Group</div> */}
                            <div ref={commandSelectorRef} onDragStart={(e) => commandDragStart(e)} onMouseEnter={(e) => commandHover(e)} className="command-selector" id="ichigime-selector" draggable="true"><i className="fas fa-grip-vertical"></i>PTP</div>
                            <div ref={commandSelectorRef} onDragStart={(e) => commandDragStart(e)} onMouseEnter={(e) => commandHover(e)} className="command-selector" id="oshituke-selector" draggable="true"><i className="fas fa-grip-vertical"></i>Push</div>
                            <div ref={commandSelectorRef} onDragStart={(e) => commandDragStart(e)} onMouseEnter={(e) => commandHover(e)} className="command-selector" id="taima-selector" draggable="true"><i className="fas fa-grip-vertical"></i>Timer</div>
                            <div ref={commandSelectorRef} onDragStart={(e) => commandDragStart(e)} onMouseEnter={(e) => commandHover(e)} className="command-selector" id="kurikaeshi-selector" draggable="true"><i className="fas fa-grip-vertical"></i>Loop</div>
                            <div ref={commandSelectorRef} onDragStart={(e) => commandDragStart(e)} onMouseEnter={(e) => commandHover(e)} className="command-selector" id="incremental-ichigime-selector" draggable="true"><i className="fas fa-grip-vertical"></i>PTP+</div>
                            <div ref={commandSelectorRef} onDragStart={(e) => commandDragStart(e)} onMouseEnter={(e) => commandHover(e)} className="command-selector" id="incremental-oshituke-selector" draggable="true"><i className="fas fa-grip-vertical"></i>Push+</div>
                            {/* <div ref={commandSelectorRef} onDragStart={(e) => commandDragStart(e)} onMouseEnter={(e) => commandHover(e)} className="command-selector" id="nyuryokuten-selector" draggable="true"><i className="fas fa-grip-vertical"></i>Execution from Input signal</div> */}
                        </div>
                    </div>
                </div>
                <div className='main-interface-section'>
                    <div className='program-block-container'>
                        <ProgramBlockEng settings={settings} isMute={isMute} tkData={tannikannsannData} setTkData={setTannikannsannData} setInputBoxType={setInputBoxType} inputBoxType={inputBoxType} loopInputObj={loopInputObj} setLoopInputObj={setLoopInputObj} typeDataObj={typeDataObj} setTypeDataObj={setTypeDataObj} typeDataRef={typeDataRef} loopInputRef={loopInputRef} isNyuryokuShingou={isNyuryokuShingou} setCmlOutput={setCmlOutput} loopData={loopData} setLoopData={setLoopData} programData={programData} setProgramData={setProgramData} jiku={jiku} setJiku={setJiku} currentDraggedCommand={currentDraggedCommand} setCurrentDraggedCommand={setCurrentDraggedCommand}/>
                    </div>
                    <div className='cml-output-container'>
                        <div className="cml-output-section">
                            <div className='cml-output-content'>
                                <h3 className='unselectable'>CML</h3>
                                <Editor value={cmlOutput} onChange={setCmlOutput} />
                            </div>
                            <div className="jikkou-button">
                                <Button variant="contained" onClick={() => showPopUpOfInstruction()}>
                                    Export<br/>text file
                                </Button>
                                <div className="copy-cml-container">
                                    <div className="copy-cml" onMouseEnter={() => display(expCopy)} onMouseLeave={() => hide(expCopy)} onClick={() => copyCML(cmlOutput)}><i className="fas fa-copy"></i></div>
                                    <div ref={expCopy} className="exp-copy hidden">copy</div>
                                    <div ref={expCopyDone} className="exp-copy-done hidden">copied!</div>
                                </div>
                            </div>
                            <div className='spacer'></div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="center-section">
                <TopMenuEng tannikannsannData={tannikannsannData} setTannikannsannData={setTannikannsannData} programData={programData} setProgramData={setProgramData} loopData={loopData} setLoopData={setLoopData} layerRef={layerRef} cmlOutput={cmlOutput} setCmlOutput={setCmlOutput} isNyuryokuShingou={isNyuryokuShingou} setIsNyuryokuShingou={setIsNyuryokuShingou} jiku={jiku} setJiku={setJiku}/>
                <ProgramBlockEng tkData={tannikannsannData} setInputBoxType={setInputBoxType} inputBoxType={inputBoxType} loopInputObj={loopInputObj} setLoopInputObj={setLoopInputObj} typeDataObj={typeDataObj} setTypeDataObj={setTypeDataObj} typeDataRef={typeDataRef} loopInputRef={loopInputRef} isNyuryokuShingou={isNyuryokuShingou} setCmlOutput={setCmlOutput} loopData={loopData} setLoopData={setLoopData} programData={programData} setProgramData={setProgramData} jiku={jiku} setJiku={setJiku} currentDraggedCommand={currentDraggedCommand} setCurrentDraggedCommand={setCurrentDraggedCommand}/>
            </div>
            <div className="cml-output-section">
                <h3 className='unselectable'>CML</h3>
                <Editor value={cmlOutput} onChange={setCmlOutput} />
                <div className="jikkou-button">
                    <Button variant="contained" onClick={() => handleFileExport()}>
                        テキストファイルにエクスポート
                    </Button>
                    <div className="copy-cml-container">
                        <div className="copy-cml" onMouseEnter={() => display(expCopy)} onMouseLeave={() => hide(expCopy)} onClick={() => copyCML(cmlOutput)}><i className="fas fa-copy"></i></div>
                        <div ref={expCopy} className="exp-copy hidden">コピー</div>
                        <div ref={expCopyDone} className="exp-copy-done hidden">コピーされました</div>
                    </div>
                </div>
            </div> */}
        </div>
    )
}