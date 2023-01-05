import React from 'react'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import { Controlled as ControlledEditor } from 'react-codemirror2'

export const Editor = (props) => {

    const handleChange = (editor, data, value) => {
        props.onChange(value)
    }

    return(
        <div className="cml-editor-container">
            <ControlledEditor 
                onBeforeChange={handleChange}
                value={props.value}
                className="cml-editor"
                options={{
                    lineWrapping: true,
                    lint: true,
                    lineNumbers: true,
                    theme: 'material'
                }} 
            />
        </div>
    )
}