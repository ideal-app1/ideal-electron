import React, { Fragment } from 'react';
import Button from '@material-ui/core/Button';
const { ipcRenderer } = window.require('electron');

const propFile = (prop, updateState) => {
    return (
        <Fragment>
            {prop.value.split('/').pop()}
            <Button
                variant="contained"
                onClick={
                    () => {
                        const file = ipcRenderer.sendSync('select-file', '')
                        if (file)
                            updateState(prop, file[0])
                    }
                }
            >Select file</Button>
        </Fragment>
    )
}

export default propFile