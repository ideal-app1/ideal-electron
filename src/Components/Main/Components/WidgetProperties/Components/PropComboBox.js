import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const propComboBox = (prop, updateState) => {
    const items = []
    prop.items.forEach(v => {
        if (v.name && v.value)
            items.push(<MenuItem key={v.name} value={v.value}>{v.name}</MenuItem>)
        else
            items.push(<MenuItem key={v} value={v}>{v}</MenuItem>)
    })
    return (
        <FormControl>
            <Select
                displayEmpty
                value={prop.value}
                onChange={event => {updateState(prop, event.target.value)}}
            >
                {items}
            </Select>
        </FormControl>
    )
}

export default propComboBox