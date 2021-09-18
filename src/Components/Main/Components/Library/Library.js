import React, {Fragment} from "react";
import "./Library.css"
import {v4 as uuid} from 'uuid';
import LibraryWidget from "./Components/LibraryWidget/LibraryWidget";
import {PropType, WidgetGroup, WidgetType} from "../../../../utils/WidgetUtils";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import Divider from "@material-ui/core/Divider";
import DisplayWidgetsStyle from "../Phone/Tools/DisplayWidgetsStyle";

export const Library = () => {

    const layouts = {
        column: {
            _id: uuid(),
            name: "Column",
            codePathFile: "Column.dart",
            properties: {
                name: {
                    value: "name",
                    type: PropType.TEXTFIELD,
                },
                direction: "column",
                justify: {
                    value: "flex-start",
                    type: PropType.COMBOBOX,
                    items: [
                        "flex-start",
                        "center",
                        "flex-end"
                    ]
                },
                align: {
                    value: "flex-start",
                    type: PropType.COMBOBOX,
                    items: [
                        "flex-start",
                        "center",
                        "flex-end"
                    ]
                },
            },
            display: DisplayWidgetsStyle.DisplayKeys.Column,

        },
        row: {
            _id: uuid(),
            name: "Row",
            codePathFile: "Row.dart",
            properties: {
                name: {
                    value: "name",
                    type: PropType.TEXTFIELD,
                },
                direction: "row",
                justify: {
                    value: "flex-start",
                    type: PropType.COMBOBOX,
                    items: [
                        "flex-start",
                        "center",
                        "flex-end"
                    ]
                },
                align: {
                    value: "flex-start",
                    type: PropType.COMBOBOX,
                    items: [
                        "flex-start",
                        "center",
                        "flex-end"
                    ]
                },
                height: {
                    value: 100,
                    type: PropType.NUMFIELD
                }
            },
            display: DisplayWidgetsStyle.DisplayKeys.Row,
        },
        center: {
            _id: uuid(),
            name: "Center",
            codePathFile: "Center.dart",
            properties: {
                name: {
                    value: "name",
                    type: PropType.TEXTFIELD,
                },
                direction: "column",
                justify: "center",
                align: "center"
            },
            display: DisplayWidgetsStyle.DisplayKeys.Center
        },
    }

    const materials = {
        button: {
            _id: uuid(),
            name: "TextButton",
            codePathFile: "Button.dart",
            properties: {
                name: {
                    value: "name",
                    type: PropType.TEXTFIELD,
                },
                text: {
                    value: "button",
                    type: PropType.TEXTFIELD,
                    variableName: "ideal_text",
                },
                color: {
                    value: "#2190d9",
                    type: PropType.COMBOBOX,
                    items: [
                        {name: "blue", value: "#2190d9"},
                        "red",
                        "green"
                    ],
                },
                enable: {
                    value: true,
                    type: PropType.CHECKBOX,
                    variableName: "ideal_enable",
                },
                width: {
                    value: 80,
                    type: PropType.NUMFIELD,
                    variableName: "ideal_width",
                },
                height: {
                    value: 40,
                    type: PropType.NUMFIELD,
                    variableName: "ideal_height",
                }
            },
            display: DisplayWidgetsStyle.DisplayKeys.Button
        },
        text: {
            _id: uuid(),
            name: "Text",
            codePathFile: "Text.dart",
            properties: {
                name: {
                    value: "name",
                    type: PropType.TEXTFIELD,
                },
                data: {
                    value: "text",
                    type: PropType.TEXTFIELD,
                    variableName: "ideal_data",
                },
                overflow: {
                    value: 'TextOverflow.clip',
                    type: PropType.COMBOBOX,
                    items: [
                        {name: 'clip', value: 'TextOverflow.clip'},
                        {name: 'ellipsis', value: 'TextOverflow.ellipsis'},
                        {name: 'fade', value: 'TextOverflow.fade'}
                    ],
                }
            },
            display: DisplayWidgetsStyle.DisplayKeys.Text
        },
        textfield: {
            _id: uuid(),
            name: "TextField",
            codePathFile: "TextField.dart",
            properties: {
                name: {
                    value: "name",
                    type: PropType.TEXTFIELD,
                },
                placeholder: {
                    value: "Placeholder",
                    type: PropType.TEXTFIELD,
                    variableName: "ideal_placeholder",
                },
                focus: false
            },
            display: DisplayWidgetsStyle.DisplayKeys.Textfield
        },
        image: {
            _id: uuid(),
            name: "Image",
            codePathFile: "Image.dart",
            properties: {
                name: {
                    value: "name",
                    type: PropType.TEXTFIELD,
                },
                url: {
                    value: "Placeholder",
                    type: PropType.TEXTFIELD,
                    variableName: "ideal_url",
                },
                rounded: {
                    value: true,
                    type: PropType.CHECKBOX
                },
                width: {
                    value: 200,
                    type: PropType.NUMFIELD,
                    variableName: "ideal_width",
                },
                height: {
                    value: 200,
                    type: PropType.NUMFIELD,
                    variableName: "ideal_height",
                }
            },
            display: DisplayWidgetsStyle.DisplayKeys.Image
        }
    }

    const groups = [
        {name: "Materials", group: WidgetGroup.MATERIAL, widgets: materials},
        {name: "Layouts", group: WidgetGroup.LAYOUT, widgets: layouts}
    ]

    const groupSection = (group) => {
        return (
            <Fragment key={group.name}>
                <ListSubheader>{group.name}</ListSubheader>
                {
                    Object.values(group.widgets).map(widget => (
                        <Fragment key={widget._id.toString()}>
                            <ListItem>
                                <LibraryWidget
                                    {...widget}
                                    group={group.group}
                                    type={WidgetType.LIBRARY}
                                    codelink={'/'}
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
        <List id={"library"}>
            {groups.map(groupSection)}
        </List>
    )
}
