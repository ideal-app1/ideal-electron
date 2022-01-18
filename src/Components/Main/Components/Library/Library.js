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
import * as Icons from '@material-ui/icons/';
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

    // TODO: find another way to get the list of icons (list is to big)
    const getIconsList = () => {
        const result = [];

        Object.keys(Icons).map((iconName) => {
            const icon_tmp = iconName.replace(/([A-Z])/g, letter => `_${letter.toLowerCase()}`);
            const icon = icon_tmp.slice(1);
            result.push({name: icon, value: 'Icons.' + icon, web: iconName});
        });

        return result;
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
        },
        carrouselslider: {
            _id: uuid(),
            name: "CarrouselSlider",
            codePathFile: "CarrouselSlider.dart",
            properties: {
                height: {
                    value: 200,
                    type: PropType.NUMFIELD,
                    variableName: "_height",
                },
            },
            display: DisplayWidgetsStyle.DisplayKeys.CarrouselSlider
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
        },
        checkbox: {
            _id: uuid(),
            name: "Checkbox",
            codePathFile: "Checkbox.dart",
            properties: {
                checked: {
                    value: false,
                    type: PropType.CHECKBOX,
                    variableName: "_checked",
                },
                data: {
                    value: "text",
                    type: PropType.TEXTFIELD,
                    variableName: "_data",
                },
                fontSize: {
                    value: 15,
                    type: PropType.NUMFIELD,
                    variableName: "_size",
                }
            },
            display: DisplayWidgetsStyle.DisplayKeys.Checkbox
        },
        icon: {
            _id: uuid(),
            name: "Icon",
            codePathFile: "Icon.dart",
            properties: {
                icon: {
                    value: 'Icons.favorite',
                    type: PropType.COMBOBOX,
                    variableName: "_icon",
                    items: [
                        {name: 'favorite', value: 'Icons.favorite', web: 'Favorite'},
                        {name: 'search', value: 'Icons.search', web: 'Search'},
                        {name: 'facebook', value: 'Icons.facebook', web: 'Facebook'},
                        {name: 'beach_access', value: 'Icons.beach_access', web: 'BeachAccess'},
                        {name: 'keyboard_voice', value: 'Icons.keyboard_voice', web: 'KeyboardVoice'},
                        {name: 'local_florist', value: 'Icons.local_florist', web: 'LocalFlorist'},
                    ],
                },
                color: {
                    value: "Colors.red",
                    type: PropType.COMBOBOX,
                    variableName: "_color",
                    items: [
                        {name: 'red', value: 'Colors.red', web: 'red'},
                        {name: 'white', value: 'Colors.white', web: 'white'},
                        {name: 'black', value: 'Colors.black', web: 'black'},
                        {name: 'blue', value: 'Colors.blue', web: 'blue'},
                        {name: 'green', value: 'Colors.green', web: 'green'},
                        {name: 'pink', value: 'Colors.pink', web: 'pink'},
                        {name: 'grey', value: 'Colors.grey', web: 'grey'},
                        {name: 'yellow', value: 'Colors.yellow', web: 'yellow'},
                    ]
                },
                size: {
                    value: 25,
                    type: PropType.NUMFIELD,
                    variableName: "_size",
                }
            },
            display: DisplayWidgetsStyle.DisplayKeys.Icon,
        },
        card: {
            _id: uuid(),
            name: "Card",
            codePathFile: "Card.dart",
            properties: {
                height: {
                    value: 300,
                    type: PropType.NUMFIELD,
                    variableName: "_height",
                },
                width: {
                    value: 200,
                    type: PropType.NUMFIELD,
                    variableName: "_width",
                },
                imgUrl: {
                    // value: null,
                    value: "https://img-19.ccm2.net/WNCe54PoGxObY8PCXUxMGQ0Gwss=/480x270/smart/d8c10e7fd21a485c909a5b4c5d99e611/ccmcms-commentcamarche/20456790.jpg",
                    type: PropType.TEXTFIELD,
                    variableName: "_imgUrl",
                },
                imgHeight: {
                    value: 150,
                    type: PropType.NUMFIELD,
                    variableName: "_imgHeight",
                },
                imgWidth: {
                    value: 200,
                    type: PropType.NUMFIELD,
                    variableName: "_imgWidth",
                },
                titleContent: {
                    value: "Title",
                    type: PropType.TEXTFIELD,
                    variableName: "_titleContent",
                },
                titleSize: {
                    value: 24,
                    type: PropType.NUMFIELD,
                    variableName: "_titleSize",
                },
                textContent: {
                    value: "Body content",
                    type: PropType.TEXTFIELD,
                    variableName: "_textContent",
                },
                textSize: {
                    value: 12,
                    type: PropType.NUMFIELD,
                    variableName: "_textSize",
                },
                buttonText: {
                    value: "button",
                    type: PropType.TEXTFIELD,
                    variableName: "_buttonText",
                },
                buttonColor: {
                    value: "Colors.black",
                    type: PropType.COMBOBOX,
                    variableName: "_buttonColor",
                    items: [
                        {name: 'red', value: 'Colors.red', web: 'red'},
                        {name: 'black', value: 'Colors.black', web: 'black'},
                        {name: 'blue', value: 'Colors.blue', web: 'blue'},
                        {name: 'green', value: 'Colors.green', web: 'green'},
                        {name: 'pink', value: 'Colors.pink', web: 'pink'},
                        {name: 'grey', value: 'Colors.grey', web: 'grey'},
                        {name: 'yellow', value: 'Colors.yellow', web: 'yellow'},
                    ],
                },
                buttonWidth: {
                    value: 80,
                    type: PropType.NUMFIELD,
                    variableName: "_buttonWidth",
                },
                buttonHeight: {
                    value: 40,
                    type: PropType.NUMFIELD,
                    variableName: "_buttonHeight",
                },
                enable: {
                    value: true,
                    type: PropType.CHECKBOX,
                    variableName: "_enable",
                },
            },
            display: DisplayWidgetsStyle.DisplayKeys.Card
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
                <Grid className={"library-" + group.name}>
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
                                    codelink={'/'}
                                />
                            </ListItem>
                        </Fragment>
                    ) : null
                    ))
                }
                </Grid>
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
                                <Icons.Search style={{fontSize: '1.5rem', paddingRight: 10}}/>
                            </InputAdornment>,
                    }}
                />
            </Grid>
            {groups.map(groupSection)}
        </List>
    )
}
