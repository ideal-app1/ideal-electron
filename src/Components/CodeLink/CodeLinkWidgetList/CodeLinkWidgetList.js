import React, {Fragment, useState} from "react";
import './CodeLinkWidgetList.css';
import Divider from "@material-ui/core/Divider";
import {Button, ListItem} from "@material-ui/core";
import CodeLinkWidgetListSearch from "./CodeLinkWidgetListSearch.js";
import {Route} from "react-router-dom";

function CodeLinkWidgetList({widgetList}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredWidgets, setFilteredWidgets] = useState(widgetList);

    return (
        <Fragment key={"Widget Menu"}>
            <CodeLinkWidgetListSearch
                widgetList={widgetList}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                setFilteredWidgets={setFilteredWidgets}
            />
            { widgetList
                ? <div className={"CodeLink-widget-content"}>
                    {
                        filteredWidgets.map(widget => (
                            <Fragment key={widget._id.toString()}>
                                <ListItem>
                                    <Route render={({ history}) => (
                                        <Button className={"widget-load-button"}
                                                variant="contained"
                                                color="primary"
                                                onClick={() => {
                                                    // history.push({
                                                    //     pathname: '/codelink/' + widget._id,
                                                    //     state: {
                                                    //         _id: widget._id,
                                                    //         name: widget.name,
                                                    //         variableName: widget.properties.name,
                                                    //         path: widget.codelink
                                                    //     }
                                                    // })
                                                }}>
                                            Widget: {widget.name}<br/>
                                            Name: {widget.properties.name.value}<br/>
                                            Id: {widget._id}
                                        </Button>
                                    )} />
                                </ListItem>
                                <Divider/>
                            </Fragment>
                        ))
                    }
                </div>
                : <p>No result</p>
            }
        </Fragment>
    );
}

export default CodeLinkWidgetList;
