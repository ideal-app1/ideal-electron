import React from "react";
import { v4 as uuid } from 'uuid';
import Widget from "./Widget";
import {WidgetType, WidgetClass} from "./utils/WidgetUtils";

export const Widgets = () => {
    const widgetList = [
        {
            _id: uuid(),
            name: "column",
            class: WidgetClass.LAYOUT,
            direction: "column",
            justify: "flex-start",
            align: "flex-start"
        },
        {
            _id: uuid(),
            name: "row",
            class: WidgetClass.LAYOUT,
            direction: "row",
            justify: "flex-start",
            align: "flex-start"
        },
        {
            _id: uuid(),
            name: "center",
            class: WidgetClass.LAYOUT,
            direction: "column",
            justify: "center",
            align: "center"
        },
        {
            _id: uuid(),
            name: "button",
            class: WidgetClass.WIDGET
        }
    ]

    return (
        <div className={"widget-list"}>
            {
                widgetList.map((widget, i) => (
                    <Widget
                        key={widget._id.toString()}
                        _id={widget._id}
                        name={widget.name}
                        class={widget.class}
                        type={WidgetType.LIST}
                        direction={widget.direction}
                        justify={widget.justify}
                        align={widget.align}
                    />
                ))
            }
        </div>
    )
}

