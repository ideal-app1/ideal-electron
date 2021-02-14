import React, {useState} from "react";
import "./WidgetProperties.css"
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import {ListSubheader} from "@material-ui/core";

class WidgetProperties extends React.Component {

    constructor(props) {
        super(props);
        this.state = {name: "test"};
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

    render () {
        return (
            <List className={"widget-properties"}>
                <ListSubheader>Button</ListSubheader>
                {<ListItem key={this.state.name}>{this.state.name}</ListItem>}
            </List>
        );
    }
}

export default WidgetProperties
