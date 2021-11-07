import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';

function PropAlignment(props) {
    const icon = <div style={{border: '#8b8b8b solid 2px', height: '11px', width: '11px', borderRadius: '2px'}}/>;
    const checkedIcon = <div style={{background: '#8b8b8b', height: '15px', width: '15px', borderRadius: '2px'}}/>;
    const customCheckbox = (align) => {
        return (
            <Checkbox
                icon={icon}
                checked={props.prop.value === 'CrossAxisAlignment.' + align}
                checkedIcon={checkedIcon}
                color="primary"
                onChange={entry => {
                    entry.target.checked ? props.updateState(props.prop,'CrossAxisAlignment.' + align) : null
                }}
            />
        );
    };
    return (
        <div>
            {customCheckbox('start')}
            {customCheckbox('center')}
            {customCheckbox('end')}
        </div>
    )
}

export default PropAlignment