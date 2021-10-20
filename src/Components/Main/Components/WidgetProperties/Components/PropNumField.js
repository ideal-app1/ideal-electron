import React from 'react';
import { InputAdornment } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

const propNumField = (prop, updateState) => {
    return (
        <TextField
            defaultValue={prop.value}
            type="number"
            variant="outlined"
            InputProps={{
                endAdornment: <InputAdornment position="end">px</InputAdornment>,
            }}
            onChange={entry => {
                let value = parseInt(entry.target.value)
                if (value <= 0) {
                    value = 0
                    entry.target.value = '0'
                }
                console.log(value);
                console.log(entry.target.value);
                updateState(prop, value)
            }}
        />
    )
}

export default propNumField