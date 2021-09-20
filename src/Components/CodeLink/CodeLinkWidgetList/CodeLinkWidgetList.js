import React, {Fragment, useState} from "react";
import Divider from "@material-ui/core/Divider";
import ListSubheader from "@material-ui/core/ListSubheader";
import {Button, ListItem} from "@material-ui/core";
import CodeLinkWidgetListSearch from "./CodeLinkWidgetListSearch.js";
import {Route} from "react-router-dom";

import Project from "../../Project/Project";
import * as fs from "fs";

function CodeLinkWidgetList({widgetList}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredWidgets, setFilteredWidgets] = useState(widgetList);


    const loadCodeLinkWidget = (history, id) => {
        const path = Project.ProjectPath + Project.Sep + ".ideal_project" + Project.Sep + "codelink" + Project.Sep + id;
        const fullPath = path + Project.Sep + id + '.json';

        if (!fs.existsSync(path)) {
            console.log("Go créer un dossier ici " + path);
            fs.mkdirSync(path, {recursive: true});
        }

        if (!fs.existsSync(fullPath)) {
            fs.appendFile(fullPath, null, { flag: 'wx' }, function (err) {
                if (err) throw err;
                console.log("It's saved here " + fullPath);
            });
        }

        history.push({
            pathname: '/codelink/' + id,
            state: {
                _id: id,
                path: path,
            }
        })
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
                                        Load<br/>{widget._id}
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