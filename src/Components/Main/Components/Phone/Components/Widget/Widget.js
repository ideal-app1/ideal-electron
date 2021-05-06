import React, {useRef, useState} from "react";
import {useDrag, useDrop} from 'react-dnd'
import "./Widget.css"
import "../Layout/Layout.css"
import WidgetProperties from "../../../WidgetProperties/WidgetProperties";
import {WidgetType} from "../../../../../../utils/WidgetUtils";
import Phone from "../../Phone";

const Widget = props => {

    const phone = Phone.getInstance()

    const ref = useRef(null);

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
            const didDrop = monitor.didDrop();
            if (!didDrop) {
                if (monitor.getItem().source === WidgetType.PHONE) {
                    phone.current.removeByID(monitor.getItem()._id)
                }
            }
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
            style={isOver ? {...props.display().style, backgroundColor: "#323232"} : props.display().style}
            onClick={(event) => {
                event.stopPropagation()
                WidgetProperties.getInstance().current.handleSelect(props._id)
            }}
            ref={ref}>
            {props.display().display}
        </div>
    );
}

export default Widget
