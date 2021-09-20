import React, { Fragment } from 'react';
import {
    DialogActions,
    DialogContent, DialogContentText,
    DialogTitle,
    InputAdornment,
    ListItem,
    TextField
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import FolderIcon from '@material-ui/icons/Folder';

import Modal from '../../Modal';
import List from '@material-ui/core/List';

const app = window.require("electron")

const LoadCodeLinkBlocks = props => {

    const [values, setValues] = React.useState({
        dir: ''
    });

    return (
        <Fragment>
            <DialogTitle>{"Load your CodeLink Blocks"}</DialogTitle>
            <DialogContent>
                <List>
                    <DialogContentText>
                        Please select your CodeLink Blocks folder
                    </DialogContentText>
                    <ListItem>
                        <TextField
                            label="Directory"
                            variant={"outlined"}
                            value={values.dir}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">
                                    <FolderIcon onClick={() => {
                                        const res = app.ipcRenderer.sendSync('select-directory');
                                        if (res.canceled)
                                            return;
                                        setValues({...values, dir: res.filePaths[0]});
                                    }}/>
                                </InputAdornment>,
                            }}
                            onChange={event => {
                                setValues({...values, dir: event.target.value});
                            }}
                            fullWidth
                        />
                    </ListItem>

                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {props.handleClose(values)}} color="primary" autoFocus>
                    Load
                </Button>
            </DialogActions>
        </Fragment>
    );
}

export default LoadCodeLinkBlocks