import React from 'react';
import { Menu, MenuItem } from '@material-ui/core';
import Phone from '../../../Phone/Phone';

const ContextMenu = props => {

    const phone = Phone.getInstance()

    let pos = { X: null, Y: null }

    if (props.event.clientX !== null && props.event.clientY !== null)
        pos = { X: props.event.clientX - 2, Y: props.event.clientY - 4 }

    const handleCut = () => {
        phone.current.setState({clipboard: props.id});
        phone.current.removeByID(props.id);
        props.handleClose();
    }

    const handleCopy = () => {
        phone.current.setState({clipboard: props.id});
        props.handleClose();
    }

    const handlePaste = () => {
        let idCopy = phone.current.state.clipboard
        const copy = phone.current.findByID(idCopy)
        if (copy)
            idCopy = phone.current.addToWidgetList(phone.current.findWidgetByID(idCopy))
        phone.current.moveByID(idCopy, props.id);
        phone.current.forceUpdate();
        props.handleClose();
    }

    return (
        <Menu
            keepMounted
            hideBackdrop={true}
            open={true}
            onClose={props.handleClose}
            anchorReference="anchorPosition"
            anchorPosition={{ top: pos.Y, left: pos.X }}
        >
            <MenuItem onClick={handleCut}>Cut</MenuItem>
            <MenuItem onClick={handleCopy}>Copy</MenuItem>
            <MenuItem onClick={handlePaste}>Paste</MenuItem>
        </Menu>
    );
}

export default ContextMenu