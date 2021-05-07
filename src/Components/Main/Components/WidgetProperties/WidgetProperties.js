import React, {Fragment} from "react";
import "./WidgetProperties.css"
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import {Button, Checkbox, ListSubheader} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import {PropType, WidgetGroup} from "../../../../utils/WidgetUtils";
import {Link, Route, useLocation} from "react-router-dom";


var fs = window.require('fs'); // Load the File System to execute our common tasks (CRUD)
const app = window.require('electron').remote.app;


const filepathCodelink = {
    filepath: ''
}

class WidgetProperties extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        
    }

    static instance = null;

    static getInstance = () => {
        if (WidgetProperties.instance == null)
            WidgetProperties.instance = React.createRef();
        return WidgetProperties.instance;
    }

    handleSelect = properties => {
        this.setState(properties)
    }

    updateState = (key, value) => {
        const updateState = {
            ...this.state,
            properties: {
                ...this.state.properties,
                [key]: {
                    ...this.state.properties[key],
                    value: value
                }
            }
        }
        this.setState(updateState)
        this.state.update(updateState)
    }

    widgetPropType = (key, value) => {
        switch (value.type) {
            case PropType.TEXTFIELD:
                return (
                    <TextField
                        defaultValue={value.value}
                        variant="outlined"
                        onChange={entry => {this.updateState(key, entry.target.value)}}
                    />
                )
            case PropType.CHECKBOX:
                return (
                    <Checkbox
                        checked={value.value}
                        color="primary"
                        onChange={entry => {this.updateState(key, entry.target.checked)}}
                    />
                )
            default:
                return (value.toString())
        }
    }

    createFile(props) {
        fs.appendFile(props.codelink, null, { flag: 'wx' }, function (err) {
            if (err) throw err;
            console.log("It's saved!");
        });
    }

    onCodelink = () => {
        this.state.codelink = app.getAppPath() + this.state.name + ".json";
        this.createFile(this.state)
        filepathCodelink.filepath = this.state.codelink
    }

    onSelection = () => {
        if (this.state.properties)
            return (
                <Fragment>
                    <ListSubheader>{this.state.name}</ListSubheader>
                    <Divider />
                    <ListItem>group: {this.state.group}</ListItem>
                    {
                        Object.entries(this.state.properties).map(([key, value]) => {
                            return (
                                <ListItem key={this.state._id + key}>{key}: {this.widgetPropType(key, value)}</ListItem>
                            );
                        })
                    }
                    {
                        this.onCodelink()
                    }
                    <Divider />
                    {
                        (this.state.group === WidgetGroup.WIDGET) ?
                            <ListItem>
                                   <Link to={`/codelink/${this.state.codelink}`}>
                                       <Button variant="contained" color="primary">
                                CodeLink</Button></Link> 
                                </ListItem> :
                            <Fragment/>
                            
                    }
                </Fragment>
            );
        else
            return ('No Selection');
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