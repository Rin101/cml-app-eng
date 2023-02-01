import React, { useRef, useState } from 'react';
import { SettingsPanel } from '../settingsPanel/settingsPanel';
import { WizardGensokuEng, WizardKikouEng, WizardSusumiryouEng, WizardBunkaiEng, WizardJikuEng } from './tanni-funcs_eng';
import { toCML } from '../toCml';
import { Link } from "react-router-dom";

// Function to download data to a file
export const downloadFile = (data, filename, type) => {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        let a = document.createElement("a"),
        url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

export const TopMenuEng = (props) => {

    const topMenuRef = useRef()
    const muteIconRef = useRef()

    const handleFileImport = (e) => {
        const reader = new FileReader()
        reader.onload = async (e) => { 
            // const obj = JSON.parse(e.target.result)
            const obj = JSON.parse(reader.result)
            // try {
                props.setJiku(obj.data.jiku)
                props.setTannikannsannData(obj.data.tannikannsannData)
                props.setProgramData(obj.data.programData)
                props.setLoopData(obj.data.loopData)
                props.setCmlOutput(toCML(obj.data.programData, obj.data.loopData, obj.data.isNyuryokuShingou, obj.data.tannikannsannData, obj.data.settings))
            // } catch (err) {
            //     alert('ファイルが間違っています')
            // }
        };
        reader.readAsText(e.target.files[0], "utf-8")
    }

    // Function to download data to a file
    const downloadFile = (data, filename, type) => {
        var file = new Blob([data], {type: type});
        if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        else { // Others
            var a = document.createElement("a"),
            url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);  
            }, 0); 
        }
    }

    const handleFileSave = () => {
        let obj = {"name":"cml-import","data":{"jiku":props.jiku,"tannikannsannData":props.tannikannsannData,"programData":props.programData,"loopData":props.loopData,"isNyuryokuShingou":props.isNyuryokuShingou, "settings":props.settings}}
        const data = JSON.stringify(obj)

        const date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let minute = date.getMinutes()
        let currentDate = `${year}_${month}_${day}_${hour}_${minute}`

        const filename = "CML_projectfile_" + currentDate
        const type = ".txt"
        downloadFile(data, filename, type)
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

    const openTanni = () => {
        document.querySelector('.tannikannsann-popup').style.display = "flex"
        props.layerRef.current.style.display = "block"
    }

    const closeTanni = (topMenuRef, layerRef) => {
        document.querySelector('.tannikannsann-popup').style.display = "none"
        // topMenuRef.current.querySelector('.tannikannsann-popup').style.display = "none"
        layerRef.current.style.display = "none"
    }

    const openSettingsPanel = () => {
        document.querySelector('#settings-panel').style.display = "flex"
        props.layerRef.current.style.display = "block"
    }

    const closeSettingsPanel = () => {
        document.current.querySelector('#settings-panel').style.display = "none"
        // topMenuRef.current.querySelector('#settings-panel').style.display = "none"
        props.layerRef.current.style.display = "none"
    }

    const toggleIsMute = (e) => {
        let isPressed = muteIconRef.current.classList.contains("fa-volume-xmark")
        if (isPressed) {
            muteIconRef.current.classList.remove("fa-volume-xmark")
            muteIconRef.current.classList.add("fa-volume-high")
            props.setIsMute(false)
        } else {
            muteIconRef.current.classList.remove("fa-volume-high")
            muteIconRef.current.classList.add("fa-volume-xmark")
            props.setIsMute(true)
        }
    }

    const muteIcon = props.isMute ? "volume-xmark" : "volume-high"
    // --
    const expSave = useRef() 
    const expImp = useRef() 
    const expTanni = useRef() 

    return (
        <div ref={topMenuRef} className="top-menu">
            <div className="top-menu-button save-file unselectable" onMouseEnter={() => display(expSave)} onMouseLeave={() => hide(expSave)} onClick={() => handleFileSave()}>
                <i className="fa-solid fa-floppy-disk"></i>Save project as
                <div ref={expSave} className="exp-box hidden">Save project in progress</div>
            </div>
            
            <div className="top-menu-button import-file unselectable" onMouseEnter={() => display(expImp)} onMouseLeave={() => hide(expImp)}>
                <label htmlFor="top-menu-file-upload">
                    <i className="fa-solid fa-folder-open"></i>Open project
                    <input id="top-menu-file-upload" accept=".txt" type="file" onChange={(e) => handleFileImport(e)}/>
                </label>
                <div ref={expImp} className="exp-box hidden">Open a saved project</div>
            </div>
            <div className="top-menu-button tannikannsann unselectable" onMouseEnter={() => display(expTanni)} onMouseLeave={() => hide(expTanni)} onClick={() => openTanni()}>
                <i className="fa-solid fa-gears"></i>Unit conversion
                <div ref={expTanni} className="exp-box hidden">Sets units and resolution</div>
            </div>
            {/* <Tannikannsann jiku={props.jiku} tannikannsannData={props.tannikannsannData} setTannikannsannData={props.setTannikannsannData} application={props.application} setApplication={props.setApplication} tanniValue={props.tanniValue} setTanniValue={props.setTanniValue} layerRef={props.layerRef} topMenuRef={topMenuRef} closeTanni={closeTanni}/> */}
            <div className="top-menu-button settings unselectable" onClick={() => openSettingsPanel()}>
                <i className="fa-solid fa-gear"></i>Settings
            </div>
            {/* <SettingsPanel closePanel={closeSettingsPanel} settings={props.settings} setSettings={props.setSettings} /> */}
            <div className='top-menu-button mute-button unselectable' onClick={(e) => toggleIsMute(e)}>
                <i ref={muteIconRef} className={"fa-solid fa-"+muteIcon}></i>
            </div>
            <a href="https://musclecorp.com/cml-app">
                <div className='top-menu-button language-button unselectable'>
                    <i className={"fa-solid fa-globe"}></i>日本語
                </div>
            </a>
        </div>
    )
}

export const Tannikannsann = (props) => {
    // props: tanniValue, setTanniValue, application, setApplication, tannikannsannData, setTannikannsannData
    
    const close = () => {
        props.closeTanni(props.topMenuRef, props.layerRef)
    }
    
    const WizardController = (props) => {
        const [history, setHistory] = useState([])
        const [wizardInput, setWizardInput] = useState(["jiku", []])

        const inputForm = () => {
            const params = {
                wizardInput: wizardInput[1], 
                history, setHistory, setWizardInput,
                tannikannsannData: props.tannikannsannData, setTannikannsannData: props.setTannikannsannData,
                jiku: props.jiku
            }
        
            switch (wizardInput[0]) {
                case "jiku":
                    return <WizardJikuEng params={params} />
                case "kikou":
                    return <WizardKikouEng params={params} />
                case "susumiryou":
                    return <WizardSusumiryouEng params={params} />
                case "gensoku":
                    return <WizardGensokuEng params={params} />
                case "bunkai":
                    return <WizardBunkaiEng close={props.close} params={params} />
                default:
                    return <WizardKikouEng params={params}/>
            }
        }

        return (
            <div className='wizard-controller'>
                    {inputForm()}
            </div>
        )
    } 

    return (
        <div className="tannikannsann-popup">
            <div className="close-popup close-tannikannsann" onClick={() => close()}><i className="fas fa-times-circle"></i></div>
            <WizardController close={close} jiku={props.jiku} tannikannsannData={props.tannikannsannData} setTannikannsannData={props.setTannikannsannData} />
        </div>
    )
}
