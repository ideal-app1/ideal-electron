import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Grid } from '@material-ui/core';

function PropComboBox(props) {
    const items = []
    props.prop.items.forEach(v => {
        if (v.name && v.value)
            items.push(<MenuItem key={v.name} value={v.value}>{v.name}</MenuItem>)
        else
            items.push(<MenuItem key={v} value={v}>{v}</MenuItem>)
    })
    return (
        <Grid container item
              direction={'column'}
              alignItems={'flex-start'}
              justifyContent={'space-between'}>
            <div className={"property-name-" + props.widget.group}>{props.name}</div>
            <FormControl variant="outlined">
                <Select
                    displayEmpty
                    value={props.prop.value}
                    onChange={event => {props.updateState(props.prop, event.target.value)}}
                >
                    {items}
                </Select>
            </FormControl>
        </Grid>
    )
}

export default PropComboBox