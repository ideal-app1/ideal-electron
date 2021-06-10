import React, {Fragment} from "react";
import "./Layout.css"
import {useDrop} from "react-dnd";
import {WidgetGroup, WidgetType} from "../../../../../../utils/WidgetUtils"
import Widget from "../Widget/Widget";
import {Grid} from "@material-ui/core";
import WidgetProperties from "../../../WidgetProperties/WidgetProperties";
import Phone from "../../Phone";
import DisplayWidgetsStyle from "../../Tools/DisplayWidgetsStyle";
import ContextMenu from '../../../Dialog/Components/ContextMenu/ContextMenu';
import Dialog from '../../../Dialog/Dialog';

const Layout = props => {

    const phone = Phone.getInstance();
    const dialog = Dialog.getInstance();

    const [{isOver, isOverCurrent}, drop] = useDrop({
        accept: WidgetType.LIBRARY,
        drop: (item, monitor) => {
            if (monitor.didDrop()) {
                return;
            }
            const tmpItem = { list: [] }
            if (item.source === WidgetType.PHONE)
                tmpItem._id = item._id
            else
                tmpItem._id = phone.current.addToWidgetList(item)
            props.list.push(tmpItem)
            phone.current.forceUpdate()
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            isOverCurrent: monitor.isOver({ shallow: true })
        }),
    });

    return (
        <Grid
            container
            direction={props.properties.direction}
            justify={props.properties.justify.value || props.properties.justify}
            alignItems={props.properties.align.value || props.properties.align}
            className={"layout " + props.name}
            wrap={"nowrap"}
            style={isOverCurrent ? {...DisplayWidgetsStyle.Display[props.display](props).style, filter: "brightness(85%)"} : {...DisplayWidgetsStyle.Display[props.display](props).style}}
            onClick={(event) => {
                event.stopPropagation();
                WidgetProperties.getInstance().current.handleSelect(props._id)
            }}
            onContextMenu={(event => {
                event.preventDefault();
                event.stopPropagation();
                dialog.current.createDialog(<ContextMenu event={event} widget={props}/>)
            })}
            ref={drop}>
            {
                props.list.map(id => {
                    const widget = phone.current.findWidgetByID(id._id)
                    if (widget.group === WidgetGroup.MATERIAL) {
                        return (<Widget key={widget._id.toString()} {...widget}/>);
                    }
                    else if (widget.group === WidgetGroup.LAYOUT) {
                        return (<Layout key={widget._id.toString()} {...widget} {...id}/>);
                    }
                    else return (<Fragment key={'empty'}/>)
                })
            }
        </Grid>
    );
};

export default Layout