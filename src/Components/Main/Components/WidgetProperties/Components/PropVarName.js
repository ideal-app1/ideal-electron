import React from 'react';
import TextField from '@material-ui/core/TextField';
import Phones from '../../Phones/Phones';
import Main from '../../../Main';

function PropVarName(props) {

    const [error, setError] = React.useState(false);

    const checkCamel = (value) => {
        return /^[a-z][A-Za-z]*$/.test(value);
    }

    return (
        <TextField
            defaultValue={props.prop.value}
            variant="outlined"
            error={error}
            onChange={entry => {
                if (Phones.phoneList[Main.selection].current.alreadyExist(props.widget, entry.target.value)) {
                    setError(true);
                    return;
                }
                props.updateState(props.prop, entry.target.value);
                setError(false);
            }}
        />
    )
}

export default PropVarName