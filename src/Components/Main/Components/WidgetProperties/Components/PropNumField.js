import React from 'react';
import { Grid, InputAdornment } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

export default function PropNumField(props) {
    return (
        <Grid container item
              direction={'column'}
              alignItems={'flex-start'}
              justifyContent={'space-between'}>
            <div className={"property-name-" + props.widget.group}>{props.name}</div>
            <TextField
                defaultValue={props.prop.value}
                type="number"
                variant="outlined"
                InputProps={{
                    endAdornment: <InputAdornment position="end">px</InputAdornment>,
                }}
                onChange={entry => {
                    let value = parseInt(entry.target.value);
                    if (value <= 0) {
                        entry.target.value = '0';
                    }
                    props.updateState(props.prop, entry.target.value);
                }}
            />
        </Grid>
    )
}