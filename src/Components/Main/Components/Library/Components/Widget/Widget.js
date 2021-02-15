import React from "react";
import { useDrag } from 'react-dnd'
import "./Widget.css"
import "../../../Phone/Components/Layout/Layout.css"
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
                console.log("clicked => " + props.name)
                WidgetProperties.getInstance().current.handleSelect(props)
            }}
            ref={drag}>
            {props.name}
        </div>
    );
}

export default Widget