import React from "react";
import { useDrag } from 'react-dnd'
import "./Widget.css"
import "../Layout/Layout.css"
import WidgetProperties from "../../../WidgetProperties/WidgetProperties";

const Widget = props => {
// eslint-disable-next-line
    const [{isDragging}, drag] = useDrag({
        item: {...props},
    });

    return (
        <div
            className={"widget " + props.name}
            onClick={(event) => {
                event.stopPropagation()
                WidgetProperties.getInstance().current.handleSelect(props)
            }}
            ref={drag}>
            {props.properties.text ? props.properties.text : props.name}
        </div>
    );
}

export default Widget