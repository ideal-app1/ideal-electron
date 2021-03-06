import React, { Fragment } from 'react';
import {
    DialogActions,
    DialogContent, DialogContentText,
    DialogTitle,
    InputAdornment,
    TextField
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import FolderIcon from '@material-ui/icons/Folder';

import Modal from '../../Modal';

const app = window.require("electron")

const FlutterSDK = props => {

    const [values, setValues] = React.useState({
        dir: ''
    });

    return (
        <Fragment>
            <DialogTitle>{"Set Flutter SDK"}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please select your flutter directory
                </DialogContentText>
                <TextField
                    label="Directory"
                    variant={"outlined"}
                    value={values.dir}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">
                            <FolderIcon onClick={() => {
                                const res = app.ipcRenderer.sendSync('select-directory-hidden');
                                if (res.canceled)
                                    return;
                                console.log(res.filePaths)
                                setValues({...values, dir: res.filePaths[0]});
                            }}/>
                        </InputAdornment>,
                    }}
                    onChange={event => {
                        setValues({...values, dir: event.target.value});
                    }}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {props.handleClose(values)}} color="primary" autoFocus>
                    Set
                </Button>
            </DialogActions>
        </Fragment>
    );
}

export default FlutterSDK