import React from 'react';
import TextField from '@material-ui/core/TextField';
import { Grid } from '@material-ui/core';

function PropTextField(props) {
    return (
        <Grid container item
              direction={'column'}
              alignItems={'flex-start'}
              justifyContent={'space-between'}>
            <div className={"property-name-" + props.widget.group}>{props.name}</div>
            <TextField
                defaultValue={props.prop.value}
                variant="outlined"
                onChange={entry => {props.updateState(props.prop, entry.target.value)}}
            />
        </Grid>
    )
}

export default PropTextField