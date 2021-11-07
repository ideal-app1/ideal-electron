import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';

function PropCheckBox(props) {
    return (
        <Checkbox
            checked={props.prop.value}
            color="primary"
            onChange={entry => {props.updateState(props.prop, entry.target.checked)}}
        />
    )
}

export default PropCheckBox