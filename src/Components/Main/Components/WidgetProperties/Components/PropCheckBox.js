import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import { FormControlLabel, Grid } from '@material-ui/core';

function PropCheckBox(props) {
    return (
        <Grid container item
              direction={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}>
            <FormControlLabel
                control={<Checkbox
                    checked={props.prop.value}
                    color="primary"
                    onChange={entry => {props.updateState(props.prop, entry.target.checked)}}
                />}
                label={props.name}
            />
        </Grid>
    );
}

export default PropCheckBox