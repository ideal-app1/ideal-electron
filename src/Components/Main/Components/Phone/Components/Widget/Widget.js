import React, {useRef, useState} from "react";
import {useDrag, useDrop} from 'react-dnd'
import "./Widget.css"
import "../Layout/Layout.css"
import WidgetProperties from "../../../WidgetProperties/WidgetProperties";
import {WidgetType} from "../../../../../../utils/WidgetUtils";
import Phone from "../../Phone";
import DisplayWidgetsStyle from "../../Tools/DisplayWidgetsStyle";

const Widget = props => {

    const phone = Phone.getInstance()

    const ref = useRef(null);

    const [state, setState] = useState({dragging: false})

    const [{isOver}, drop] = useDrop({
        accept: WidgetType.LIBRARY,
        drop: (item, monitor) => {
            if (monitor.didDrop()) {
                return;
            }
            if (item.source === WidgetType.PHONE) {
                phone.current.moveByID(item._id, props._id)
            } else {
                const itemID = phone.current.addToWidgetList(item)
                phone.current.moveByID(itemID, props._id)
            }
            phone.current.componentDidUpdate()
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    })

    const [{isDragging}, drag] = useDrag({
        item: {...props},
        isDragging: monitor => {
            if (state.dragging && monitor.getItem().source === WidgetType.PHONE) {
                phone.current.removeByID(monitor.getItem()._id)
                setState({dragging: false})
            }
        },
        begin: () => {
            setState({dragging: true})
        },
        end: (draggedItem, monitor) => {
            const didDrop = monitor.didDrop();
            if (!didDrop) {
                phone.current.componentDidUpdate()
                console.log('dropped outside');
            }
        },
        collect: monitor => ({
            isDragging: monitor.isDragging()
        })
    });

    drag(drop(ref));

    return (
        <div
            className={"widget " + props.name}
            style={isOver ? {...DisplayWidgetsStyle.Display[props.display](DisplayWidgetsStyle.Display).style, backgroundColor: "#323232"} : DisplayWidgetsStyle.Display[props.display](props).style}
            onClick={(event) => {
                event.stopPropagation()
                WidgetProperties.getInstance().current.handleSelect(props._id)
            }}
            ref={ref}>
            {DisplayWidgetsStyle.Display[props.display](props).display}
        </div>
    );
}

export default Widget
