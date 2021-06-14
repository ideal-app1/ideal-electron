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
import {Route} from "react-router-dom";
import Phone from "../Phone/Phone";
import Main from "../../Main";
import { InputAdornment } from '@material-ui/core';

const fs = window.require('fs');
const { ipcRenderer } = window.require('electron')
const path = require("path")


class WidgetProperties extends React.Component {

    constructor(props) {
        super(props);
        this.state = { widget: {} };
        this.phone = Phone.getInstance()
    }

    static instance = null;

    static getInstance = () => {
        if (WidgetProperties.instance == null)
            WidgetProperties.instance = React.createRef();
        return WidgetProperties.instance;
    }

    handleSelect = id => {
        this.setState({ widget: this.phone.current.findWidgetByID(id) })
    }

    unsetState = () => {
        this.setState({ widget: {} })
    }

    updateState = (key, value) => {
        this.state.widget.properties[key].value = value
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
                        InputProps={{
                            endAdornment: <InputAdornment position="end">px</InputAdornment>,
                        }}
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

    createFile(path) {
        if (fs.existsSync(path)) {
            return;
        }
        fs.appendFile(path, null, { flag: 'wx' }, function (err) {
            if (err) throw err;
            console.log("It's saved here " + path);
        });
    }

    onCodelink = () => {
        this.state.widget.codelink =  Main.MainProjectPath + Main.Sep + ".ideal_project" + Main.Sep + "codelink" + Main.Sep + this.state.widget._id;
        let fullPath = this.state.widget.codelink + Main.Sep + this.state.widget._id + '.json';

        console.log("Go créer un fichier ici " + this.state.widget.codelink);
        fs.mkdirSync(this.state.widget.codelink, {recursive: true});
        this.createFile(fullPath)
    }

    codeLinkButton = () => {
        if (this.state.widget.group === WidgetGroup.MATERIAL) {
            return (
                <ListItem>
                    <Route render={({ history}) => (
                        <Button className="codelink-button"
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    history.push({
                                        pathname: '/codelink/' + this.state.widget._id,
                                        state: {
                                            _id: this.state.widget._id,
                                            path: this.state.widget.codelink
                                        }
                                    })
                                }}>
                            CodeLink
                        </Button>
                    )} />
                </ListItem>
            )
        } else {
            return (<Fragment/>)
        }
    }

    onSelection = () => {
        if (this.state.widget.properties) {
            this.onCodelink()
            return (
                <Fragment>
                    <ListSubheader>{this.state.widget.name}</ListSubheader>
                    <ListItem>
                        <div className={"property_name"}>group:</div>
                        {this.state.widget.group}
                    </ListItem>
                    {
                        Object.entries(this.state.widget.properties).map(([key, value]) => {
                            return (
                                <ListItem key={this.state.widget._id + key}>
                                    <div className={"property_name"}>{key}:</div>
                                    {this.widgetPropType(key, value)}
                                </ListItem>
                            );
                        })
                    }
                    <Divider/>
                    {this.codeLinkButton()}
                </Fragment>
            );
        } else
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
