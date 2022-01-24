import React from 'react';
import TextField from '@material-ui/core/TextField';
import Phones from '../../Phones/Phones';

function PropVarName(props) {

    const [error, setError] = React.useState(false);
    const [edit, setEditing] = React.useState(false);

    const checkCamel = (value) => {
        return /^[a-z][A-Za-z]*$/.test(value);
    }

    if (edit) {
        return (
            <TextField
                defaultValue={props.prop.value}
                variant="outlined"
                error={error}
                onChange={entry => {
                    if (Phones.actualPhone().alreadyExist(props.widget, entry.target.value)) {
                        setError(true);
                        return;
                    }
                    props.updateState(props.prop, entry.target.value);
                    setError(false);
                }}
                onSubmit={() => {setEditing(false)}}
            />
        )
    }
    return (
        <div onClick={() => setEditing(true)}>
            {props.prop.value}
        </div>
    )
}

export default PropVarName