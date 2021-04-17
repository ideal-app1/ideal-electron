import React, {Fragment} from "react";
import "./WidgetProperties.css"
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import {Button, Checkbox, Dialog, ListSubheader} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import {PropType, WidgetGroup} from "../../../../utils/WidgetUtils";
import {Link, Route} from "react-router-dom";
import CodeLink from "../../../CodeLink/CodeLink";
import process from 'process';


var fs = window.require('fs'); // Load the File System to execute our common tasks (CRUD)
var dialog = window.require('electron').remote.dialog;


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

    selectFolder() {
        let data;
        let test = dialog.showOpenDialog({
            title:"Select a folder",
            properties: ["openDirectory"]
        }, (folderPaths) => {
            // folderPaths is an array that contains all the selected paths
            if(data === undefined){
                console.log("No destination folder selected");
                return;
            }else{
                console.log(folderPaths);
            }
        });
        return test
    }

    createFile(content, props) {
        console.log("createFile")
        console.log(props.codelink)
        fs.appendFile(props.codelink, content, { flag: 'wx' }, function (err) {
            if (err) throw err;
            console.log("It's saved!");
        });
    }

    readFile(data) {
        dialog.showOpenDialog((data) => {
            // fileNames is an array that contains all the selected
            if(data === undefined){
                console.log("No file selected");
                return;
            }
        
            fs.readFile(data, 'utf-8', (err, data) => {
                if(err){
                    alert("An error ocurred reading the file :" + err.message);
                    return;
                }
        
                // Change how to handle the file content
                console.log("The file content is : " + data);
            });
        });
    }

    updateFile(data) {
        var filepath = "C:/Previous-filepath/existinfile.txt";// you need to save the filepath when you open the file to update without use the filechooser dialog againg
        var content = "This is the new content of the file";

        fs.writeFile(filepath, content, (err) => {
            if (err) {
                alert("An error ocurred updating the file" + err.message);
                console.log(err);
                return;
            }

            alert("The file has been succesfully saved");
        });
    }

    newCodelink(props) {
        console.log(props)
        let content = "Some text to save into the file";
        props.codelink = process.cwd() + props.group + ".json";
        this.createFile(content, props)
        console.log("Props le voici")
        console.log(props.codelink)
        
        return (props)
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
                    <Divider />
                    {
                        (this.state.group === WidgetGroup.WIDGET) ?
                            <ListItem>
                                <Button variant="contained" color="primary">CodeLink</Button>
                                
                                <Link to={"/a"} params={{test : this.state}}><Button variant="contained" color="primary" onClick={() => this.newCodelink(this.state)}>
                                Test button</Button></Link>
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