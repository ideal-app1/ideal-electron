import React, {Fragment, useState} from "react";
import Phone from "../../Main/Components/Phone/Phone"
import Divider from "@material-ui/core/Divider";
import ListSubheader from "@material-ui/core/ListSubheader";
import {Button, ListItem} from "@material-ui/core";
import CodeLinkWidgetListSearch from "./CodeLinkWidgetListSearch.js";

function CodeLinkWidgetList({widgetList}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredWidgets, setFilteredWidgets] = useState(widgetList);

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
                                <Button variant="contained" color="secondary" onClick={() => {
                                }}>Load<br/>{widget._id}</Button>
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