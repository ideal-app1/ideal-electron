import React, {Fragment} from "react";
import "./Library.css"
import { v4 as uuid } from 'uuid';
import LibraryWidget from "./Components/LibraryWidget/LibraryWidget";
import {WidgetType, WidgetGroup, PropType} from "../../../../utils/WidgetUtils";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import Divider from "@material-ui/core/Divider";

export const Library = () => {
    const widgets = {
        column: {
            _id: uuid(),
            name: "column",
            group: WidgetGroup.LAYOUT,
            properties: {
                direction: "column",
                justify: "flex-start",
                align: "center"
            }
        },
        row: {
            _id: uuid(),
            name: "row",
            group: WidgetGroup.LAYOUT,
            properties: {
                direction: "row",
                justify: "flex-start",
                align: "flex-start"
            }
        },
        center: {
            _id: uuid(),
            name: "center",
            group: WidgetGroup.LAYOUT,
            properties: {
                direction: "column",
                justify: "center",
                align: "center"
            }
        },
        button: {
            _id: uuid(),
            name: "button",
            group: WidgetGroup.WIDGET,
            properties: {
                color: "blue"
            }
        },
        text: {
            _id: uuid(),
            name: "text",
            group: WidgetGroup.WIDGET,
            properties: {
                text: {
                    value: "text",
                    type: PropType.TEXTFIELD
                },
                empty: true
            },
            display: function () {
                return this.properties.text.value
            }
        },
        textfield: {
            _id: uuid(),
            name: "text field",
            group: WidgetGroup.WIDGET,
            properties: {
                placeholder: {
                    value: "Placeholder",
                    type: PropType.TEXTFIELD
                },
                focus: false
            },
            display: function () {
                return this.properties.placeholder.value
            }
        },
        image: {
            _id: uuid(),
            name: "image",
            group: WidgetGroup.WIDGET,
            properties: {
                rounded: {
                    value: true,
                    type: PropType.CHECKBOX
                }
            },
            display: function () {
                return this.name
            }
        }
    }

    const ListGroups = (name, group) => {
        return (
            <Fragment>
                <ListSubheader>{name}</ListSubheader>
                {
                    Object.values(widgets).filter(w => w.group === group).map(widget => (
                        <Fragment key={widget._id.toString()}>
                            <ListItem>
                                <LibraryWidget
                                    type={WidgetType.LIBRARY}
                                    {...widget}
                                />
                            </ListItem>
                            <Divider />
                        </Fragment>
                    ))
                }
            </Fragment>
        )
    }

    return (
        <List className={"library"}>
            {ListGroups("Widgets", WidgetGroup.WIDGET)}
            {ListGroups("Layouts", WidgetGroup.LAYOUT)}
        </List>
    )
}

