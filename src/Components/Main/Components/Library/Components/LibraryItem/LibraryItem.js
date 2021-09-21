import React from "react";
import { useDrag } from 'react-dnd'
import "./LibraryItem.css"
import "../../../Phone/Components/Layout/Layout.css"

const LibraryItem = props => {

    const [{isDragging}, drag] = useDrag({
        item: {...props},
    });

    return (
        <div className={"library-item " + props.name.toLowerCase() + " item-" + props.group} ref={drag}>
            {props.name}
        </div>
    );
}

export default LibraryItem