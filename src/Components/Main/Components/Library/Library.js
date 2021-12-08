import React, {Fragment, useState} from "react";
import "./Library.css"
import {v4 as uuid} from 'uuid';
import LibraryItem from './Components/LibraryItem/LibraryItem';
import {LayoutType, PropType, WidgetGroup, WidgetType} from "../../../../utils/WidgetUtils";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import Divider from "@material-ui/core/Divider";
import DisplayWidgetsStyle from "../Phone/Tools/DisplayWidgetsStyle";
import {Search} from "@material-ui/icons";
import { Grid, InputAdornment } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';


export const Library = (props) => {

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
            type: PropType.ALIGNMENT,
            items: [
                {name: 'start', value: 'CrossAxisAlignment.start', style: 'flex-start'},
                {name: 'center', value: 'CrossAxisAlignment.center', style: 'center'},
                {name: 'end', value: 'CrossAxisAlignment.end', style: 'flex-end'},
                // {name: 'baseline', value: 'CrossAxisAlignment.baseline', style: 'baseline'},
                // {name: 'stretch', value: 'CrossAxisAlignment.stretch', style: 'stretch'}
            ]
        },
        size: (w, h) => {
            return { value: {w: w || 0, h: h || 0, lockRatio: false}, type: PropType.SIZE }
        }
    }

    const layouts = {
        column: {
            _id: uuid(),
            name: "Column",
            codePathFile: "Column.dart",
            properties: {
                direction: "column",
                child: {
                    value: "[]",
                    type: PropType.HIDDEN,
                    variableName: "ideal_child",
                },
                mainAxisAlignment: defaultProperties.mainAxisAlignment,
                crossAxisAlignment: defaultProperties.crossAxisAlignment
            },
            layoutType: LayoutType.CHILDREN,
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
                size: defaultProperties.size(100),
            },
            layoutType: LayoutType.CHILDREN,
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
            layoutType: LayoutType.CHILD,
            display: DisplayWidgetsStyle.DisplayKeys.Center
        },
        stack: {
            _id: uuid(),
            name: "Stack",
            codePathFile: "Stack.dart",
            properties: {
                height: {
                    value: 250,
                    type: PropType.NUMFIELD
                },
                width: {
                    value: 300,
                    type: PropType.NUMFIELD
                },
                alignment: {
                    value: "Alignment.topLeft",
                    type: PropType.COMBOBOX,
                    items: [
                        {name: 'topLeft', value: 'Alignment.topLeft', style: 'flex-start'},
                        {name: 'center', value: 'Alignment.center', style: 'center'},
                        {name: 'bottomLeft', value: 'Alignment.bottomLeft', style: 'flex-end'}
                    ]
                }
            },
            layoutType: LayoutType.CHILDREN,
            display: DisplayWidgetsStyle.DisplayKeys.Stack
        },
        positioned: {
            _id: uuid(),
            name: "Positioned",
            codePathFile: "Positioned.dart",
            properties: {
                left: {
                    value: null,
                    type: PropType.NUMFIELD,
                    variableName: "_left",
                },
                right: {
                    value: null,
                    type: PropType.NUMFIELD,
                    variableName: "_right",
                },
                bottom: {
                    value: null,
                    type: PropType.NUMFIELD,
                    variableName: "_bottom",
                },
                top: {
                    value: 0,
                    type: PropType.NUMFIELD,
                    variableName: "_top",
                },
            },
            layoutType: LayoutType.CHILD,
            display: DisplayWidgetsStyle.DisplayKeys.Positioned
        },
        container: {
            _id: uuid(),
            name: "Container",
            codePathFile: "Container.dart",
            properties: {
                height: {
                    value: 250,
                    type: PropType.NUMFIELD,
                    variableName: "_height",
                },
                width: {
                    value: 300,
                    type: PropType.NUMFIELD,
                    variableName: "_width",
                },
                color: {
                    value: "",
                    type: PropType.COLOR,
                    variableName: "_color",
                },
                marginHorizontal: {
                    value: "0",
                    type: PropType.NUMFIELD,
                    variableName: "_marginHorizontal",
                },

                bottomLeft: {
                    value: 10,
                    type: PropType.NUMFIELD,
                    variableName: "_bottomLeft",
                },
                bottomRight: {
                    value: 10,
                    type: PropType.NUMFIELD,
                    variableName: "_bottomRight",
                },
                topLeft: {
                    value: 10,
                    type: PropType.NUMFIELD,
                    variableName: "_topLeft",
                },
                topRight: {
                    value: 10,
                    type: PropType.NUMFIELD,
                    variableName: "_topRight",
                },
            },
            layoutType: LayoutType.CHILD,
            display: DisplayWidgetsStyle.DisplayKeys.Container
        },
        padding: {
            _id: uuid(),
            name: "Padding",
            codePathFile: "Padding.dart",
            applied: true,
            properties: {
                padding: {
                    value: 5,
                    type: PropType.NUMFIELD
                },
            },
            display: DisplayWidgetsStyle.DisplayKeys.Padding
        }
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
                    variableName: "_text",
                },
                color: {
                    value: "#2190d9",
                    type: PropType.COMBOBOX,
                    items: [
                        {name: "blue", value: "#2190d9"},
                        {name: "red", value: "#F05C5C"},
                        {name: "green", value: "#67F05C"}
                    ],
                },
                enable: {
                    value: true,
                    type: PropType.CHECKBOX,
                    variableName: "_enable",
                },
                width: {
                    value: 80,
                    type: PropType.NUMFIELD,
                    variableName: "_width",
                },
                height: {
                    value: 40,
                    type: PropType.NUMFIELD,
                    variableName: "_height",
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
                    variableName: "_data",
                },
                fontSize: {
                    value: 15,
                    type: PropType.NUMFIELD,
                    variableName: "_size",
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
                placeholder: {
                    value: "Placeholder",
                    type: PropType.TEXTFIELD,
                    variableName: "_placeholder",
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
                    value: null,
                    type: PropType.TEXTFIELD,
                    variableName: "_url",
                },
                rounded: {
                    value: true,
                    type: PropType.CHECKBOX
                },
                size: defaultProperties.size(200, 200)
            },
            display: DisplayWidgetsStyle.DisplayKeys.Image
        }
    }

    const groups = [
        {name: "Materials", group: WidgetGroup.MATERIAL, widgets: materials},
        {name: "Layouts", group: WidgetGroup.LAYOUT, widgets: layouts}
    ]

    const [searchQuery, setSearchQuery] = useState('');

    const filterWidget = (widget, query) => {
        if (!query) {
            return widget;
        }

        return widget.name.toLowerCase().includes(query.toLowerCase());
    }

    const groupSection = (group) => {
        return (
            <Fragment key={group.name}>
                <ListSubheader>{group.name}</ListSubheader>
                {
                    Object.values(group.widgets).map(widget =>
                    ( filterWidget(widget, searchQuery) ? (
                        <Fragment key={widget._id.toString()}>
                            <ListItem>
                                <LibraryItem
                                    {...widget}
                                    group={group.group}
                                    properties={{
                                        name: {
                                            value: widget.name,
                                            type: PropType.VAR,
                                        },
                                        ...widget.properties
                                    }}
                                    type={WidgetType.LIBRARY}
                                    selected={false}
                                    hover={false}
                                    visualiser={false}
                                    codelink={'/'}
                                />
                            </ListItem>
                        </Fragment>
                    ) : null
                    ))
                }
            </Fragment>
        )
    }

    return (
        <List id={"library"} style={props.style}>
            <Grid container alignItems={'center'} justifyContent={'center'} direction={'row'} style={{marginBottom: "10px"}}>
                <TextField
                    id="widgets-search"
                    type="text"
                    placeholder="Search widgets"
                    value={searchQuery}
                    style={{color: '#aaaaaa', padding: 10}}
                    onChange={e => {
                        e.preventDefault();
                        setSearchQuery(e.target.value);
                    }}
                    InputProps={{ startAdornment:
                            <InputAdornment position="end">
                                <Search style={{fontSize: '1.5rem', paddingRight: 10}}/>
                            </InputAdornment>,
                    }}
                />
            </Grid>
            {groups.map(groupSection)}
        </List>
    )
}
