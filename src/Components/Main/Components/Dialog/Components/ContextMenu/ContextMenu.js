import React from 'react';
import { Menu, MenuItem } from '@material-ui/core';
import './ContextMenu.css';

import Divider from '@material-ui/core/Divider';
import MenuFunctions from '../../../../Tools/MenuFunctions';

const ContextMenu = props => {

    const menuFunc = new MenuFunctions();

    let pos = { X: null, Y: null }

    if (props.event.clientX !== null && props.event.clientY !== null)
        pos = { X: props.event.clientX - 2, Y: props.event.clientY - 4 }

    const menuItem = (name, handler, disable, className) => {
        if (disable)
            return <MenuItem className={'disabled'}>{name}</MenuItem>
        const handleClick = () => {
            handler(props);
            props.handleClose();
        }
        return <MenuItem className={className} onClick={handleClick}>{name}</MenuItem>
    }

    return (
        <Menu
            keepMounted
            open
            onClose={props.handleClose}
            onContextMenu={props.handleClose}
            anchorReference="anchorPosition"
            anchorPosition={{ top: pos.Y, left: pos.X }}
            autoFocus={false}
            id={'context-menu'}
        >
            {menuItem('Cut', menuFunc.cut, props.widget.root)}
            {menuItem('Copy', menuFunc.copy, props.widget.root)}
            {menuItem('Paste', menuFunc.paste)}
            <Divider/>
            {menuItem('Delete', menuFunc.remove, props.widget.root, 'danger')}
        </Menu>
    );
}

export default ContextMenu