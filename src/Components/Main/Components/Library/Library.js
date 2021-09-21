import React, {Fragment} from "react";
import "./Library.css"
import {v4 as uuid} from 'uuid';
import LibraryItem from './Components/LibraryItem/LibraryItem';
import {PropType, WidgetGroup, WidgetType} from "../../../../utils/WidgetUtils";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import Divider from "@material-ui/core/Divider";
import DisplayWidgetsStyle from "../Phone/Tools/DisplayWidgetsStyle";

export const Library = () => {

    const defaultProperties = {
        mainAxisAlignment: {
            value: "MainAxisAlignment.start",
            type: PropType.COMBOBOX,
            items: [
                {name: 'start', value: 'MainAxisAlignment.start', style: 'flex-start'},
                {name: 'center', value: 'MainAxisAlignment.center', style: 'center'},
                {name: 'end', value: 'MainAxisAlignment.end', style: 'flex-end'},
                {name: 'spaceAround', value: 'MainAxisAlignment.spaceAround', style: 'space-around'},
                {name: 'spaceBetween', value: 'MainAxisAlignment.spaceBetween', style: 'space-between'},
                {name: 'spaceEvenly', value: 'MainAxisAlignment.spaceEvenly', style: 'space-evenly'}
            ]
        },
        crossAxisAlignment: {
            value: "CrossAxisAlignment.start",
            type: PropType.COMBOBOX,
            items: [
                {name: 'start', value: 'CrossAxisAlignment.start', style: 'flex-start'},
                {name: 'center', value: 'CrossAxisAlignment.center', style: 'center'},
                {name: 'end', value: 'CrossAxisAlignment.end', style: 'flex-end'},
                {name: 'baseline', value: 'CrossAxisAlignment.baseline', style: 'baseline'},
                {name: 'stretch', value: 'CrossAxisAlignment.stretch', style: 'stretch'}
            ]
        }
    }

    const layouts = {
        column: {
            _id: uuid(),
            name: "Column",
            codePathFile: "Column.dart",
            properties: {
                direction: "column",
                mainAxisAlignment: defaultProperties.mainAxisAlignment,
                crossAxisAlignment: defaultProperties.crossAxisAlignment
            },
            display: DisplayWidgetsStyle.DisplayKeys.Column,
        },
        row: {
            _id: uuid(),
            name: "Row",
            codePathFile: "Row.dart",
            properties: {
                direction: "row",
                mainAxisAlignment: defaultProperties.mainAxisAlignment,
                crossAxisAlignment: defaultProperties.crossAxisAlignment,
                width: {
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
                direction: "column",
                mainAxisAlignment: "center",
                crossAxisAlignment: "center"
            },
            display: DisplayWidgetsStyle.DisplayKeys.Center
        },
        //stack
        /*padding: {
            _id: uuid(),
            name: "Padding",
            codePathFile: "Padding.dart",
            properties: {
                padding: {
                    value: 5,
                    type: PropType.NUMFIELD
                },
            },
            display: DisplayWidgetsStyle.DisplayKeys.Padding
        }*/
        //padding
    }

    const materials = {
        //container
            //color - border radius
        button: {
            _id: uuid(),
            name: "TextButton",
            codePathFile: "Button.dart",
            properties: {
                text: {
                    value: "button",
                    type: PropType.TEXTFIELD,
                    codeFlag: "IDEAL_BUTTON_TEXT",
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
                state: {
                    value: "enabled",
                    type: PropType.COMBOBOX,
                    items: [
                        "enabled",
                        "disabled"
                    ],
                    codeFlag: "IDEAL_BUTTON_STATE",
                },
                width: {
                    value: 80,
                    type: PropType.NUMFIELD,
                    codeFlag: "IDEAL_BUTTON_WIDTH",
                },
                height: {
                    value: 40,
                    type: PropType.NUMFIELD,
                    codeFlag: "IDEAL_BUTTON_HEIGHT",
                }
            },
            display: DisplayWidgetsStyle.DisplayKeys.Button
        },
        //IconButton
        text: {
            _id: uuid(),
            name: "Text",
            codePathFile: "Text.dart",
            properties: {
                data: {
                    value: "text",
                    type: PropType.TEXTFIELD,
                    codeFlag: "IDEAL_TEXT",
                },
                //font-size
                overflow: {
                    value: 'TextOverflow.clip',
                    type: PropType.COMBOBOX,
                    items: [
                        {name: 'clip', value: 'TextOverflow.clip'},
                        {name: 'ellipsis', value: 'TextOverflow.ellipsis'},
                        {name: 'fade', value: 'TextOverflow.fade'}
                    ]
                }
            },
            display: DisplayWidgetsStyle.DisplayKeys.Text
        },
        textfield: {
            _id: uuid(),
            name: "TextField",
            codePathFile: "TextField.dart",
            properties: {
                placeholder: {
                    value: "Placeholder",
                    type: PropType.TEXTFIELD,
                    codeFlag: "IDEAL_PLACEHOLDER",
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
                url: {
                    value: "Placeholder",
                    type: PropType.TEXTFIELD,
                    codeFlag: "IDEAL_URL",
                },
                rounded: {
                    value: true,
                    type: PropType.CHECKBOX
                },
                width: {
                    value: 200,
                    type: PropType.NUMFIELD,
                    codeFlag: "IDEAL_IMAGE_WIDTH",
                },
                height: {
                    value: 200,
                    type: PropType.NUMFIELD,
                    codeFlag: "IDEAL_IMAGE_HEIGHT",
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
                                <LibraryItem
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
