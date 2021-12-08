import React, {useRef, useState} from "react";
import {useDrag, useDrop} from 'react-dnd'
import "./Widget.css"
import "../Layout/Layout.css"
import WidgetProperties from "../../../WidgetProperties/WidgetProperties";
import {WidgetType} from "../../../../../../utils/WidgetUtils";
import Phone from "../../Phone";
import DisplayWidgetsStyle from "../../Tools/DisplayWidgetsStyle";
import Dialog from '../../../Dialog/Dialog';
import ContextMenu from '../../../Dialog/Components/ContextMenu/ContextMenu';
import Phones from "../../../Phones/Phones";
import Main from "../../../../Main";

const Widget = props => {

    const widget = WidgetProperties.getInstance();
    const dialog = Dialog.getInstance();

    const ref = useRef(null);

    const [state, setState] = useState({dragging: false})

    const [{isOver}, drop] = useDrop({
        accept: WidgetType.LIBRARY,
        drop: (item, monitor) => {
            if (monitor.didDrop())
                return;
            Phones.phoneList[Main.selection].moveInListByID(props, item);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    })

    const [{isDragging}, drag] = useDrag({
        item: {...props},
        isDragging: monitor => {
            if (state.dragging && monitor.getItem().source === WidgetType.PHONE) {
                Phones.phoneList[Main.selection].removeByID(monitor.getItem()._id)
                setState({dragging: false})
            }
        },
        begin: () => {
            setState({dragging: true})
        },
        end: (draggedItem, monitor) => {
            const didDrop = monitor.didDrop();
            if (!didDrop) {
                Phones.phoneList[Main.selection].getRef().current.componentDidUpdate()
                console.log("Connaître le widget ? " + widget.current)
                //widget.current.deleteCodelinkFile()
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
            className={"widget " + props.name.toLowerCase() + (props.selected ? " selected" : "") + (props.hover ? " hover" : "")}
            style={isOver ? {...DisplayWidgetsStyle.Display[props.display](props).style, backgroundColor: "#323232"} : DisplayWidgetsStyle.Display[props.display](props).style}
            onClick={(event) => {
                if (Main.selection !== null && Main.selection >= 0) {
                    event.stopPropagation();
                    WidgetProperties.getInstance().current.handleSelect(props._id);
                }
            }}
            onContextMenu={(event => {
                event.preventDefault();
                event.stopPropagation();
                dialog.current.createDialog(<ContextMenu event={event} widget={props}/>)
            })}
            ref={ref}>
            {DisplayWidgetsStyle.Display[props.display](props).display}
        </div>
    );
}

export default Widget
