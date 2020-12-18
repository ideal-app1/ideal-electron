import React from "react";
import { useDrag } from 'react-dnd'
import "./Widget.css"
import "./Layout.css"

const Widget = props => {

    const [{isDragging}, drag] = useDrag({
        item: {
            _id: props._id,
            type: props.type,
            name: props.name,
            class: props.class,
            direction: props.direction,
            justify: props.justify,
            align: props.align
        },
    });

    return (
        <div className={"widget " + props.name} ref={drag}>
            {props.name}
        </div>
    );
}

export default Widget