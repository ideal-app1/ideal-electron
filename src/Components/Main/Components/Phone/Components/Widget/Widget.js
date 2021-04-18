import React, {useRef} from "react";
import {useDrag, useDrop} from 'react-dnd'
import "./Widget.css"
import "../Layout/Layout.css"
import WidgetProperties from "../../../WidgetProperties/WidgetProperties";
import {WidgetType} from "../../../../../../utils/WidgetUtils";

const Widget = props => {
// eslint-disable-next-line

    const ref = useRef(null);

    const [{isOver}, drop] = useDrop({
        accept: WidgetType.LIBRARY,
        drop: (item, monitor) => {
            console.log('drop in widget')
            //console.log(props, monitor.getItem())
            if (item.source === WidgetType.PHONE) {
                console.log(props)
                item.move(props)
            }
            //monitor.getItem().update({...monitor.getItem(), pos: props._id})
        },
        hover: (item, monitor) => {
            if (item.source === WidgetType.PHONE)
                item.remove()
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    })

    const [{isDragging}, drag] = useDrag({
        item: {...props},
    });

    drag(drop(ref));

    return (
        <div
            className={"widget " + props.name}
            style={props.display().style}
            onClick={(event) => {
                event.stopPropagation()
                WidgetProperties.getInstance().current.handleSelect(props)
            }}
            ref={ref}>
            {props.display().display}
        </div>
    );
}

export default Widget