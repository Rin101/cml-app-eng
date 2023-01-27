import { Button } from '@mui/material'
import { useState, useRef, useEffect } from 'react'
import { SettingInfo } from './settingInfo'
import './settingsPanel.css'

export const SettingsPanel = ({ closePanel, settings, setSettings }) => {

    const settingsPanelData = {
        "kyoutuu": [
            {"kNum":5, "name":"inposition", "label":"In-position Range", "inputType":"text", "infoText":'Set the range for In-position.'},
        ],
        "oshituke": [
            {"kNum":11, "name":"oshitukeDousaMode", "label":"Push Motion Operation Mode", "inputType":"dropdown", "inputs":["Continuous(One direction)","Set time(One direction)","Continuous(Both direction)","Set time(Both direction)",], "infoText":<>Set the direction and time for Push Motion<br/>():Direction to limit torque.<br/>One direction:Torque is limited only in operation direction.<br/>Both direction:Torque is limited in both directions</>},
            {"kNum":12, "name":"oshitukeDousaTorque", "label":"Push Motion Torque", "inputType":"text", "infoText":<>Set the torque during pressing operation by command Q or Z in % of the rated torque.</>},
            {"kNum":13, "name":"oshitukeDousaTime", "label":"Push Motion Holding Time", "inputType":"text", "infoText":'Set Push Motion Holding Time (Ref: 8.6.2)'},
        ],
        "genten": [
            {"kNum":22, "name":"gentenShingou", "label":"Origin Signal Source", "inputType":"dropdown", "inputs":["Stopper Detection","Stopper Detection (Auto)","Origin Sensor","Origin Sensor(Auto)"], "infoText":<>Set the origin detection signal source and detection method. The origin sensor can be assigned only to input point 1.<br/>(Auto): Automatic origin detection operation starts when the power is turned on.<br/>Ref: 11.1</>},
            {"kNum":23, "name":"gentenSpeed", "label":"Origin Detection Speed", "inputType":"text", "infoText":'Set the speed for Origin Detection'},
            {"kNum":24, "name":"gentenAccel", "label":"Origin Detection Acceleration", "inputType":"text", "infoText":'Set the acceleration for Origin Detection'},
            {"kNum":25, "name":"gentenDirection", "label":"Origin Detection Direction", "inputType":"dropdown", "inputs":["CW","CCW"], "infoText":'Set the direction for Origin Detection'},
            {"kNum":26, "name":"gentenOffset", "label":"Origin Offset Distance", "inputType":"text", "infoText":<>Set offset amount from detected origin to coordinate origin</>},
            {"kNum":27, "name":"gentenUnit", "label":"Unit of Origin Offset Distance", "inputType":"dropdown", "inputs":["100","10","1"], "infoText":'Set the unit when Offset is set'},
            {"kNum":28, "name":"gentenTorque", "label":"Stopper Detection Torque", "inputType":"text", "infoText":<>Set the torque to detect a stopper for Origin Detection by percentage to rated torque<br/>Ref: 11.1.1</>},
        ],
    }

    const [settingsObj, setSettingsObj] = useState(settings)
    useEffect(() => {
        console.log(settingsObj)
    }, [settingsObj])

    const SettingsPanelItem = ({ data }) => {

        const [inputValue, setInputValue] = useState(settingsObj["kNum" + data["kNum"].toString()])

        const setTextInputValue = (value) => {
            setInputValue(value)
            let tmp = settingsObj
            tmp["kNum" + data["kNum"].toString()] = value
            setSettingsObj(tmp)
        }

        const setDropdownValue = (inputValue) => {
            const inputIndex = data["inputs"].indexOf(inputValue)
            setInputValue(inputIndex)
            let tmp = settingsObj
            tmp["kNum" + data["kNum"].toString()] = inputIndex
            setSettingsObj(tmp)
        }

        switch (data["inputType"]) {
            case "text":
                return (
                    <div className='settings-panel-item'>
                        <div className='settings-panel-item-label-container'>
                            <p className='settings-panel-item-label'>{ data["label"] }</p>
                            <SettingInfo text={ data["infoText"] } />
                        </div>
                        <input className='settings-panel-item-input' placeholder={inputValue} onChange={(e) => setTextInputValue(e.target.value)}/>
                    </div>
                )
            case "dropdown":
                return (
                    <div className='settings-panel-item'>
                        <div className='settings-panel-item-label-container'>
                            <p className='settings-panel-item-label'>{ data["label"] }</p>
                            <SettingInfo text={ data["infoText"] } />
                        </div>
                        <div className='settings-panel-item-input'>
                            <Dropdown setItem={setDropdownValue} defaultItem={data["inputs"][inputValue]} itemArr={data["inputs"]} />
                        </div>
                    </div>
                )
            default:
                return
        }
    }

    const saveChanges = () => {
        closePanel()
        setSettings(settingsObj)
    }

    return (
        <div id="settings-panel">
            <div id="close-settings-panel" onClick={() => closePanel()}><i className="fas fa-times"></i></div>
            {/* content */}
            <div className='settings-panel-block'>
                <p className='settings-panel-block-label'>Common Settings</p>
                <div className='settings-panel-block-contents'>
                    { settingsPanelData["kyoutuu"].map((item, i) => <SettingsPanelItem data={item} key={i}/>) }
                </div>
            </div>
            <div className='settings-panel-block'>
                <p className='settings-panel-block-label'>Push Motion Operation Settings</p>
                <div className='settings-panel-block-contents'>
                    { settingsPanelData["oshituke"].map((item, i) => <SettingsPanelItem data={item} key={i} />) }
                </div>
            </div>
            <div className='settings-panel-block'>
                <p className='settings-panel-block-label'>Origin Detection Settings</p>
                <div className='settings-panel-block-contents'>
                    { settingsPanelData["genten"].map((item, i) => <SettingsPanelItem data={item} key={i} />) }
                </div>
            </div>
            <div id='save-changes-button'>
                <Button variant="contained" onClick={() => saveChanges()}>
                    変更を保存
                </Button>
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
            <div ref={selectedItemRef} className="selected-item-smaller unselectable" onClick={() => showItems()}>{selectedItem}<i className="fas fa-angle-down"></i></div>
            <div ref={dropdownItems} className="dropdown-items unselectable">
                {dropdowns()}
            </div>
        </div>
    )
}