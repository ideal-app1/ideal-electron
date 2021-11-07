import React from 'react';
import TextField from '@material-ui/core/TextField';

function PropTextField(props) {
    return (
        <TextField
            defaultValue={props.prop.value}
            variant="outlined"
            onChange={entry => {props.updateState(props.prop, entry.target.value)}}
        />
    )
}

export default PropTextField