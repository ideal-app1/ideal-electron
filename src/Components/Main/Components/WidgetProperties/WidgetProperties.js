import React, {Fragment} from "react";
import "./WidgetProperties.css"
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Button from "@material-ui/core/Button";
import ListSubheader from "@material-ui/core/ListSubheader";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";

import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {PropType, WidgetGroup} from "../../../../utils/WidgetUtils";
import {Link, Route, useLocation} from "react-router-dom";
import Phone from "../Phone/Phone";

var fs = window.require('fs'); // Load the File System to execute our common tasks (CRUD)
const app = window.require('electron').remote.app;

const { ipcRenderer } = window.require('electron')

const filepathCodelink = {
    filepath: ''
}


class WidgetProperties extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.phone = Phone.getInstance()
    }

    static instance = null;

    static getInstance = () => {
        if (WidgetProperties.instance == null)
            WidgetProperties.instance = React.createRef();
        return WidgetProperties.instance;
    }

    handleSelect = id => {
        this.setState(this.phone.current.findWidgetByID(id))
    }

    updateState = (key, value) => {
        this.state.properties[key].value = value
        this.forceUpdate()
        this.phone.current.forceUpdate()
    }

    widgetPropType = (name, prop) => {
        switch (prop.type) {
            case PropType.TEXTFIELD:
                return (
                    <TextField
                        defaultValue={prop.value}
                        variant="outlined"
                        onChange={entry => {this.updateState(name, entry.target.value)}}
                    />
                )
            case PropType.NUMFIELD:
                return (
                    <TextField
                        defaultValue={prop.value}
                        type="number"
                        variant="outlined"
                        onChange={entry => {this.updateState(name, parseInt(entry.target.value))}}
                    />
                )
            case PropType.CHECKBOX:
                return (
                    <Checkbox
                        checked={prop.value}
                        color="primary"
                        onChange={entry => {this.updateState(name, entry.target.checked)}}
                    />
                )
            case PropType.COMBOBOX:
                const items = []
                prop.items.forEach(v => {
                    if (v.name && v.value)
                        items.push(<MenuItem key={v.name} value={v.value}>{v.name}</MenuItem>)
                    else
                        items.push(<MenuItem key={v} value={v}>{v}</MenuItem>)
                })
                return (
                    <FormControl >
                        <Select
                            displayEmpty
                            value={prop.value}
                            onChange={event => {this.updateState(name, event.target.value)}}
                        >
                            {items}
                        </Select>
                    </FormControl>
                )
            case PropType.FILE:
                return (
                    <Fragment>
                        {prop.value.split('/').pop()}
                        <Button
                            variant="contained"
                            onClick={
                                () => {
                                    const file = ipcRenderer.sendSync('select-file', '')
                                    if (file)
                                        this.updateState(name, file[0])
                                }
                            }
                        >Select file</Button>
                    </Fragment>
                )
            default:
                return (prop.toString())
        }
    }

    createFile(props) {
        fs.appendFile(props.codelink, null, { flag: 'wx' }, function (err) {
            if (err) throw err;
            console.log("It's saved!");
        });
    }

    onCodelink = () => {
        this.state.codelink = app.getAppPath() + this.state._id + this.state.name + ".json";
        this.createFile(this.state)
        filepathCodelink.filepath = this.state.codelink
    }

    onSelection = () => {
        if (this.state.properties)
            return (
                <Fragment>
                    <ListSubheader>{this.state.name}</ListSubheader>
                    <ListItem><div className={"property_name"}>group:</div>{this.state.group}</ListItem>
                    {
                        Object.entries(this.state.properties).map(([key, value]) => {
                            return (
                                <ListItem key={this.state._id + key}>
                                    <div className={"property_name"}>{key}:</div>
                                    {this.widgetPropType(key, value)}
                                </ListItem>
                            );
                        })
                    }
                    {
                        this.onCodelink()
                    }
                    <Divider />
                    {
                        (this.state.group === WidgetGroup.MATERIAL) ?
                            <ListItem>
                                <Route render={({ history}) => (
                                    <Button className="codelink-button"
                                        variant="contained"
                                        color="primary"
                                        onClick={() => {history.push(`/codelink/${this.state.codelink}/${this.state._id}`)}}>
                                        CodeLinknnn</Button>
                                )} />
                            </ListItem> :
                            <Fragment/>
                            
                    }
                </Fragment>
            );
        else
            return (<div id={'no-selection'}>No Selection</div>);
    }

    render () {
        
        return (
            <List className={"widget-properties"}>
                {this.onSelection()}
            </List>
        )
    }
}

export default WidgetProperties
