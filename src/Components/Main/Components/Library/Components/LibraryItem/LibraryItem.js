import React from "react";
import { useDrag } from 'react-dnd'
import "./LibraryItem.css"
import "../../../Phone/Components/Layout/Layout.css"
import WidgetTabs from '../../../WidgetTabs/WidgetTabs';

const LibraryItem = props => {

    let safeTimeout;

    const [{isDragging}, drag] = useDrag({
        item: {...props},
        begin: () => {
            safeTimeout = setTimeout(() => WidgetTabs.getInstance().current.handleTab(1), 500);

        },
        end: (draggedItem, monitor) => {
            clearTimeout(safeTimeout);
            WidgetTabs.getInstance().current.handleTab(0);
        },
    });

    return (
        <div className={"library-item " + "library-" + props.name.toLowerCase() + " item-" + props.group} ref={drag}>
            {props.name}
        </div>
    );
}

export default LibraryItem