import React, {Fragment} from "react";
import "./WidgetProperties.css"
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import {ListSubheader} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";

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
        console.log("update")
        this.setState(properties)
    }

    onSelection = () => {
        if (Object.entries(this.state).length)
            return (
                <Fragment>
                    <ListSubheader>{this.state.name}</ListSubheader>
                    <Divider />
                    <ListItem>group: {this.state.group}</ListItem>
                    {
                        Object.entries(this.state.properties).map(([k, v]) => {
                            if (k === "text") {
                                return (
                                    <ListItem key={k}>{k}:
                                        <TextField defaultValue={v.toString()} variant="outlined" onChange={entry => {
                                            console.log(entry.target.value)
                                            this.setState({...this.state, text: entry.target.value})
                                        }}/>
                                    </ListItem>
                                );
                            } else {
                                return (<ListItem key={k}>{k}: {v.toString()}</ListItem>);
                            }
                        })
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
        );
    }
}

export default WidgetProperties
