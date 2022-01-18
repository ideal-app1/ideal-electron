import React from 'react';
import { InputAdornment } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

export default function PropNumField(props) {
    return (
        <TextField
            defaultValue={props.prop.value}
            variant="outlined"
            InputProps={{
                endAdornment: <InputAdornment position="end">px</InputAdornment>,
            }}
            onChange={entry => {
                let value = parseInt(entry.target.value);
                if (value <= 0) {
                    value = 0;
                    entry.target.value = '0';
                }
                props.updateState(props.prop, entry.target.value);
            }}
        />
    )
}