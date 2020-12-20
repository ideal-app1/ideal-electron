import React from "react";
import { v4 as uuid } from 'uuid';
import Widget from "./Widget";
import {WidgetType, WidgetClass} from "./utils/WidgetUtils";

export const WidgetList = () => {
    const widgetList = [
        {
            _id: uuid(),
            name: "column",
            class: WidgetClass.LAYOUT,
            direction: "column",
            justify: "flex-start",
            align: "center"
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
                widgetList.map(widget => (
                    <Widget
                        key={widget._id.toString()}
                        type={WidgetType.LIST}
                        {...widget}
                    />
                ))
            }
        </div>
    )
}

