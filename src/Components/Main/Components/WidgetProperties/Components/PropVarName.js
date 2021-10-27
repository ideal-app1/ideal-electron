import React from 'react';
import TextField from '@material-ui/core/TextField';
import Phones from '../../Phones/Phones';
import Main from '../../../Main';

const propTextField = (prop, updateState) => {

    return (
        <TextField
            defaultValue={prop.value}
            variant="outlined"
            //error={true}
            onChange={entry => {
                if (Phones.phoneList[Main.selection].current.alreadyExist(prop, entry.target.value)) {
                    return;
                }
                updateState(prop, entry.target.value)
            }}
        />
    )
}

export default propTextField