import React from "react";
import { useDrag } from 'react-dnd'
import "./Widget.css"
import "./Layout.css"

const Widget = props => {

    const [{isDragging}, drag] = useDrag({
        item: {...props},
    });

    return (
        <div className={"widget " + props.name} ref={drag}>
            {props.name}
        </div>
    );
}

export default Widget