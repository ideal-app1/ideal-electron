import React from 'react';
import { ClickAwayListener, Menu, MenuItem } from '@material-ui/core';
import Phone from '../../../Phone/Phone';
import './ContextMenu.css';

import clone from "rfdc/default";
import Divider from '@material-ui/core/Divider';
import WidgetProperties from '../../../WidgetProperties/WidgetProperties';

const ContextMenu = props => {

    const phone = Phone.getInstance()

    let pos = { X: null, Y: null }

    if (props.event.clientX !== null && props.event.clientY !== null)
        pos = { X: props.event.clientX - 2, Y: props.event.clientY - 4 }

    const handleCut = () => {
        console.log(props.widget)
        const copy = clone(props.widget);
        //const copyID = phone.current.findByID(props.widget._id);

        phone.current.setState({clipboard: {widget: copy}});
        phone.current.removeByID(props._id);
        props.handleClose();
    }

    const handleCopy = () => {
        console.log(props.widget)
        const copy = clone(props.widget);
        //const copyID = phone.current.findByID(props.widget._id);

        phone.current.setState({clipboard: {widget: copy}});
        props.handleClose();
    }

    const handlePaste = () => {
        console.log(props.widget)
        let idCopy = phone.current.state.clipboard;
        let id = idCopy.widget._id;
        const copy = phone.current.findByID(idCopy.widget._id);
        const dest = phone.current.findByID(props.widget._id);
        if (copy.child)
            id = phone.current.addToWidgetList(idCopy.widget);

        //console.log(idCopy.list)
        if (props.widget.group === 'layout')
            dest.child.list.push({_id: id, list: []})
        else
            phone.current.moveByID(id, props.widget._id);

        phone.current.forceUpdate();
        props.handleClose();
    }

    const handleRm = () => {
        const widgetList = phone.current.flattenByID(props.widget._id);
        phone.current.removeWidgetByID(props.widget._id)
        widgetList.forEach(widget => phone.current.removeWidgetByID(widget));
        phone.current.removeByID(props.widget._id);
        phone.current.forceUpdate();
        WidgetProperties.getInstance().current.unsetState();
        props.handleClose();
    }

    const menuItem = (name, handler, className) => {
        if (props.widget.root)
            return <MenuItem className={'disabled'}>{name}</MenuItem>
        return <MenuItem className={className} onClick={handler}>{name}</MenuItem>
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
            {menuItem('Cut', handleCut)}
            {menuItem('Copy', handleCopy)}
            <MenuItem onClick={handlePaste}>Paste</MenuItem>
            <Divider/>
            {menuItem('Delete', handleRm, 'danger')}
        </Menu>
    );
}

export default ContextMenu