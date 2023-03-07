import { useRef } from "react"

export const SettingsDefaultInfo = ({ info }) => {

    const textBoxRef = useRef()

    const display = () => {
        textBoxRef.current.classList.add("shown")
        textBoxRef.current.classList.remove("hidden")
        setTimeout(() => {
            if (!textBoxRef.current.classList.contains("hidden")) {
                textBoxRef.current.style.display = "block"
            }
        }, 300)
    }

    const hide = () => {
        textBoxRef.current.classList.remove('shown')
        textBoxRef.current.classList.add('hidden')
        textBoxRef.current.style.display = "none"
    }

    const defaultValues = {
        'kNum5': 5, 'kNum11': 0, 'kNum12': 30, 'kNum13': 200, 'kNum14': 0, 'kNum22': 0,
        'kNum23': 10, 'kNum24': 10, 'kNum25': 0, 'kNum26': 0, 'kNum27': 0, 'kNum28': 30
    }

    const displayInfo = () => {
        let infoList = []
        for (let item of info["kyoutuu"]) {
            if (item["inputType"] === "text") {
                infoList.push(<p key={item}>{item["label"]}: {defaultValues["kNum"+item["kNum"]]}</p>)
            } else {
                infoList.push(<p key={item}>{item["label"]}: {item["inputs"][defaultValues["kNum"+item["kNum"]]]}</p>)
            }
        }
        for (let item of info["oshituke"]) {
            if (item["inputType"] === "text") {
                infoList.push(<p key={item}>{item["label"]}: {defaultValues["kNum"+item["kNum"]]}</p>)
            } else {
                infoList.push(<p key={item}>{item["label"]}: {item["inputs"][defaultValues["kNum"+item["kNum"]]]}</p>)
            }
        }
        for (let item of info["genten"]) {
            if (item["inputType"] === "text") {
                infoList.push(<p key={item}>{item["label"]}: {defaultValues["kNum"+item["kNum"]]}</p>)
            } else {
                infoList.push(<p key={item}>{item["label"]}: {item["inputs"][defaultValues["kNum"+item["kNum"]]]}</p>)
            }
        }
        return infoList
    }

    return (
        <div className="settings-panel-default-info-container" onMouseEnter={() => display()} onMouseLeave={() => hide()}>
            <i className="fa-solid fa-circle-question settings-panel-item-info"></i>
            <div ref={textBoxRef} className='settings-panel-default-info-box'>
                { displayInfo() }
            </div>
        </div>
    )
}