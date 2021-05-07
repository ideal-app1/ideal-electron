import React, {Fragment} from "react";
import "./Library.css"
import {v4 as uuid} from 'uuid';
import LibraryWidget from "./Components/LibraryWidget/LibraryWidget";
import {PropType, WidgetGroup, WidgetType} from "../../../../utils/WidgetUtils";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import Divider from "@material-ui/core/Divider";

export const Library = () => {

    const layouts = {
        column: {
            _id: uuid(),
            name: "column",
            codePathFile: "Column.dart",
            properties: {
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
                }
            },
            display: function () {
                return {
                    style: {
                        justifyContent: this.properties.justify.value,
                        alignItems: this.properties.align.value
                    }
                }
            }
        },
        row: {
            _id: uuid(),
            name: "row",
            codePathFile: "Row.dart",
            properties: {
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
            display: function () {
                return {
                    style: {
                        justifyContent: this.properties.justify.value,
                        alignItems: this.properties.align.value,
                        height: this.properties.height.value + "%"
                    }
                }
            }
        },
        center: {
            _id: uuid(),
            name: "center",
            codePathFile: "Center.dart",
            properties: {
                direction: "column",
                justify: "center",
                align: "center"
            },
            display: () => {return {}}
        },
    }

    const materials = {
        button: {
            _id: uuid(),
            name: "button",
            codePathFile: "Button.dart",
            properties: {
                text: {
                    value: "button",
                    type: PropType.TEXTFIELD
                },
                color: {
                    value: "#2190d9",
                    type: PropType.COMBOBOX,
                    items: [
                        {name: "blue", value: "#2190d9"},
                        "red",
                        "green"
                    ]
                },
                state: {
                    value: "enabled",
                    type: PropType.COMBOBOX,
                    items: [
                        "enabled",
                        "disabled"
                    ]
                },
                width: {
                    value: 80,
                    type: PropType.NUMFIELD
                },
                height: {
                    value: 40,
                    type: PropType.NUMFIELD
                }
            },
            display: function () {
                return {
                    display: this.properties.text.value,
                    style: {
                        backgroundColor: this.properties.state.value === "disabled" ? "lightgray" : this.properties.color.value,
                        width: this.properties.width.value,
                        height: this.properties.height.value
                    }
                }
            }
        },
        text: {
            _id: uuid(),
            name: "text",
            codePathFile: "Text.dart",
            properties: {
                data: {
                    value: "text",
                    type: PropType.TEXTFIELD
                },
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
            display: function () {
                return {display: this.properties.data.value}
            }
        },
        textfield: {
            _id: uuid(),
            name: "text field",
            codePathFile: "TextField.dart",
            properties: {
                placeholder: {
                    value: "Placeholder",
                    type: PropType.TEXTFIELD
                },
                focus: false
            },
            display: function () {
                return {display: this.properties.placeholder.value}
            }
        },
        image: {
            _id: uuid(),
            name: "image",
            codePathFile: "Image.dart",
            properties: {
                file: {
                    value: "/",
                    type: PropType.FILE
                },
                rounded: {
                    value: true,
                    type: PropType.CHECKBOX
                },
                width: {
                    value: 200,
                    type: PropType.NUMFIELD
                },
                height: {
                    value: 200,
                    type: PropType.NUMFIELD
                }
            },
            display: function () {
                return {
                    display: this.name,
                    style: {
                        borderRadius: this.properties.rounded.value ? "20px" : "0",
                        width: this.properties.width.value,
                        height: this.properties.height.value
                    }
                }
            }
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
                                    group={group.group}
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
        <List id={"library"}>
            {groups.map(groupSection)}
        </List>
    )
}
