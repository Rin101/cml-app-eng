import { useRef } from "react"

export const SettingInfo = ({ text }) => {

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

    return (
        <div className="settings-panel-item-info-container" onMouseEnter={() => display()} onMouseLeave={() => hide()}>
            <i className="fa-solid fa-circle-question settings-panel-item-info"></i>
            <div ref={textBoxRef} className='settings-panel-item-info-box'>
                <p>{ text }</p>
            </div>
        </div>
    )
}