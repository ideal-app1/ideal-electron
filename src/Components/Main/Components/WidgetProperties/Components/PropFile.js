import React, { Fragment } from 'react';
import Button from '@material-ui/core/Button';
const { ipcRenderer } = window.require('electron');

function PropFile(props) {
    return (
        <Fragment>
            {props.prop.value.split('/').pop()}
            <Button
                variant="contained"
                onClick={
                    () => {
                        const file = ipcRenderer.sendSync('select-file', '')
                        if (file)
                            props.updateState(props.prop, file[0])
                    }
                }
            >Select file</Button>
        </Fragment>
    )
}

export default PropFile