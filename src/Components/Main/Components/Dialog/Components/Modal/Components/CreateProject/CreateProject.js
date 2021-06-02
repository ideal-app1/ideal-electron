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

const CreateProject = props => {

    const [values, setValues] = React.useState({
        dir: '',
        name: 'idealproject'
    });

    return (
        <Fragment>
            <DialogTitle>{"Create a project"}</DialogTitle>
            <DialogContent>
                <List>
                    <DialogContentText>
                        Please select where the project should be created and choose its name
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
                    <ListItem>
                        <TextField
                            label={"Name"}
                            variant={"outlined"}
                            defaultValue={values.name}
                            value={values.name}
                            onChange={event => {
                                setValues({...values, name: event.target.value.toLowerCase()});
                            }}
                            fullWidth
                        />
                    </ListItem>
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {props.handleClose(values)}} color="primary" autoFocus>
                    Create
                </Button>
            </DialogActions>
        </Fragment>
    );
}

export default CreateProject