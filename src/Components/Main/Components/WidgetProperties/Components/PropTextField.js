import React from 'react';
import TextField from '@material-ui/core/TextField';

const propTextField = (prop, updateState) => {
    return (
        <TextField
            defaultValue={prop.value}
            variant="outlined"
            onChange={entry => {updateState(prop, entry.target.value)}}
        />
    )
}

export default propTextField