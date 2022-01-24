import React, { Fragment } from 'react';
import { Collapse, Grid } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import { ExpandLess, ExpandMore } from '@material-ui/icons';

function PropsGroupItem(props) {

    const [open, setOpen] = React.useState(props.group.open === undefined || props.group.open);

    const handleClick = () => {
        props.group.open = !open;
        setOpen(!open);
    };

    return (
        <Fragment>
            <div className={'property-item'}>
                <Grid item container
                      direction={'row'}
                      alignItems={'center'}
                      justifyContent={'space-between'}
                      onClick={handleClick}
                      className={'GridSubheader-group'}>
                    <Grid item>{props.group.groupName}</Grid>
                    <Grid item>
                        {open ? <ExpandLess /> : <ExpandMore />}
                    </Grid>
                </Grid>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    {
                        props.group.items.map(property => {
                            return (
                                <div className={'property-item'} key={props.widget._id + property}>
                                    {props.widgetPropType(props.widget.properties[property], property)}
                                </div>
                            )
                        })
                    }
                </Collapse>
            </div>
            <Divider/>
        </Fragment>
    )
}

export default PropsGroupItem