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

const Widget = props => {

    const phone = Phone.getInstance();
    const widget = WidgetProperties.getInstance();
    const dialog = Dialog.getInstance();

    const ref = useRef(null);

    const [state, setState] = useState({dragging: false})

    const [{isOver}, drop] = useDrop({
        accept: WidgetType.LIBRARY,
        drop: (item, monitor) => {
            if (monitor.didDrop()) {
                return;
            }

            if (item.applied) {
                console.log(phone.current.state);
                const itemID = phone.current.addToWidgetList(item);
                phone.current.moveByID(itemID, props._id);
                const itemApplied = phone.current.findByID(itemID);
                const itemProps = phone.current.findByID(props._id);
                console.log(itemApplied, itemProps);
                itemApplied.child.list.push(itemProps.child);
                itemApplied.parent.list = itemApplied.parent.list.filter(x => x._id !== props._id);
                phone.current.forceUpdate();
            } else if (item.source === WidgetType.PHONE) {
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
            className={"widget " + props.name.toLowerCase() + (props.selected ? " selected" : "")}
            style={isOver ? {...DisplayWidgetsStyle.Display[props.display](props).style, backgroundColor: "#323232"} : DisplayWidgetsStyle.Display[props.display](props).style}
            onClick={(event) => {
                event.stopPropagation();
                /*console.log('select');
                let widget = phone.current.findWidgetByID(props._id);
                widget.selected = !widget.selected;
                phone.current.forceUpdate();*/
                WidgetProperties.getInstance().current.handleSelect(props._id);
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
