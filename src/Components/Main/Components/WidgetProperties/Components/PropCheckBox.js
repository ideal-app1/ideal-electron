import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';

const propCheckBox = (prop, updateState) => {
    return (
        <Checkbox
            checked={prop.value}
            color="primary"
            onChange={entry => {updateState(prop, entry.target.checked)}}
        />
    )
}

export default propCheckBox