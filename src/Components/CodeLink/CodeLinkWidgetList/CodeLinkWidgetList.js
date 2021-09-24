import React, {Fragment, useState} from "react";
import Divider from "@material-ui/core/Divider";
import ListSubheader from "@material-ui/core/ListSubheader";
import {Button, ListItem} from "@material-ui/core";
import CodeLinkWidgetListSearch from "./CodeLinkWidgetListSearch.js";
import Phone from "../../Main/Components/Phone/Phone";
import {Route} from "react-router-dom";

import Main from "../../Main/Main";
import * as fs from "fs";

function CodeLinkWidgetList({widgetList}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredWidgets, setFilteredWidgets] = useState(widgetList);

    const loadCodeLinkWidget = (history, id) => {
        // const phone = Phone.getInstance()
        // const widget = phone.current.findWidgetByID(id)
        //
        // console.log(widget)
        //
        // history.push({
        //     pathname: '/codelink/' + widget._id,
        //     state: {
        //         _id: widget._id,
        //         name: widget.name,
        //         variableName: widget.properties.name,
        //         path: widget.codelink
        //     }
        // })
    }

    return (
        <Fragment key={"Widget Menu"}>
            <ListSubheader>{"Widget Menu"}</ListSubheader>
            <br/>
            <CodeLinkWidgetListSearch
                widgetList={widgetList}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                setFilteredWidgets={setFilteredWidgets}
            />
            <div className={"CodeLink-widget-content"}>
                {
                    filteredWidgets.map(widget => (
                        <Fragment key={widget._id.toString()}>
                            <ListItem>
                                <Route render={({ history}) => (
                                    <Button variant="contained"
                                            color="secondary"
                                            onClick={() => loadCodeLinkWidget(history, widget._id)}>
                                        Load<br/>{widget.name}<br/>{widget._id}
                                    </Button>
                                )} />
                            </ListItem>
                            <Divider/>
                        </Fragment>
                    ))
                }
            </div>
        </Fragment>
    );
}

export default CodeLinkWidgetList;
