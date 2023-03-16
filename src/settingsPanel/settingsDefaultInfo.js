import { useState } from "react"
import { useRef } from "react"

export const SettingsDefaultInfo = ({ info }) => {

    const textBoxRef = useRef()
    const [isShown, setIsShown] = useState(false);

    const display = () => {
        setIsShown(true)
        // textBoxRef.current.classList.add("shown")
        // textBoxRef.current.classList.remove("hidden")
        // textBoxRef.current.style.display = "block"
    }

    const hide = () => {
        setIsShown(false)
        // textBoxRef.current.classList.remove('shown')
        // textBoxRef.current.classList.add('hidden')
        // textBoxRef.current.style.display = "none"
    }

    const defaultValues = {
        'kNum5': 5, 'kNum11': 0, 'kNum12': 30, 'kNum13': 200, 'kNum14': 0, 'kNum22': 0,
        'kNum23': 10, 'kNum24': 10, 'kNum25': 1, 'kNum26': 0, 'kNum28': 30
    }

    const displayInfo = () => {
        let infoList = []
        for (let item of info["kyoutuu"]) {
            if (item["inputType"] === "text") {
                infoList.push(<p key={item["kNum"]}>{item["kNum"]}: {item["label"]}: {defaultValues["kNum"+item["kNum"]]}</p>)
            } else {
                infoList.push(<p key={item["kNum"]}>{item["kNum"]}: {item["label"]}: {item["inputs"][defaultValues["kNum"+item["kNum"]]]}</p>)
            }
        }
        for (let item of info["oshituke"]) {
            if (item["inputType"] === "text") {
                infoList.push(<p key={item["kNum"]}>{item["kNum"]}: {item["label"]}: {defaultValues["kNum"+item["kNum"]]}</p>)
            } else {
                infoList.push(<p key={item["kNum"]}>{item["kNum"]}: {item["label"]}: {item["inputs"][defaultValues["kNum"+item["kNum"]]]}</p>)
            }
        }
        for (let item of info["genten"]) {
            if (item["inputType"] === "text") {
                infoList.push(<p key={item["kNum"]}>{item["kNum"]}: {item["label"]}: {defaultValues["kNum"+item["kNum"]]}</p>)
            } else {
                infoList.push(<p key={item["kNum"]}>{item["kNum"]}: {item["label"]}: {item["inputs"][defaultValues["kNum"+item["kNum"]]]}</p>)
            }
        }
        return infoList
    }

    const constantValues = [
        [2, "100"], [3, "サーボオン"], [4, "CW 方向を正座標"], [7, "無効"], [27, "100"], [30, "無効"], [43, "0000"], [44, "汎用入力"], 
        [45, "汎用入力"], [46, "汎用入力"], [47, "汎用入力"], [53, "111"], [55, "汎用出力"], [56, "汎用出力"], [57, "汎用出力"], [65, "有効"], 
        [71, "38.4"], [74, "38.4"], [81, "1"], [82, "1"]
    ]
    const constantNumNames = {
        2:"速度単位",3:"電源 ON 時のサーボ状態",4:"座標方向",7:"ソフトリミット設定",27:"原点オフセット距離単位",
        30:"原点検出完了確認",43:"入力論理",44:"入力 1 機能選択",45:"入力 2 機能選択",46:"入力 3 機能選択",
        47:"入力 4 機能選択",53:"出力論理",55:"出力 1 機能選択",56:"出力 2 機能選択",57:"出力 3 機能選択",
        65:"ステータス LED",71:"通信ボーレート",74:"スレーブ間通信ボーレート",
        81:"電源 ON 時に実行されるロジックバンク No", 82:"ロジックバンクの実行周期"
    }

    const displayConstants = () => {
        let infoList = []
        for (let item of constantValues) {
            infoList.push(<p key={item[0]}>{item[0]}: {constantNumNames[item[0]]}: {item[1]}</p>)
        }
        return infoList
    }

    return (
        <div className="settings-panel-default-info-container">
            <i id="openDefaultValues" onClick={() => display()} className="fa-solid fa-circle-question settings-panel-item-info"></i>
            <div ref={textBoxRef} style={{display: isShown?"block":"none"}} className='settings-panel-default-info-box'>
                <div id="closeKNumDefaultInfo" className="close-default" onClick={() => hide()}><i className="fas fa-times"></i></div>
                <div>k値: 名前: デフォルト値</div>
                <div style={{marginTop: "10px"}}></div>
                <div>{ displayInfo() }</div>
                <div style={{marginTop: "30px"}}></div>
                <div style={{opacity:"0.8"}}>{displayConstants()}</div>
            </div>
        </div>
    )
}