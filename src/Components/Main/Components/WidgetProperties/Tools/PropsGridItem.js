import React, { Fragment } from 'react';
import Divider from '@material-ui/core/Divider';

function PropsGridItem(props) {
    return (
        <Fragment>
            <div className={'property-item'}>
                {props.widgetPropType(props.prop, props.name)}
            </div>
            <Divider/>
        </Fragment>
    )
}

export default PropsGridItem