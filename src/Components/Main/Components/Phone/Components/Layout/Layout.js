import React, {Fragment} from "react";
import "./Layout.css"
import {useDrop} from "react-dnd";
import {WidgetGroup, WidgetType} from "../../../../../../utils/WidgetUtils"
import Widget from "../Widget/Widget";
import {Grid} from "@material-ui/core";
import WidgetProperties from "../../../WidgetProperties/WidgetProperties";
import DisplayWidgetsStyle from "../../Tools/DisplayWidgetsStyle";
import ContextMenu from '../../../Dialog/Components/ContextMenu/ContextMenu';
import Dialog from '../../../Dialog/Dialog';
import Phones from "../../../Phones/Phones";
import Main from "../../../../Main";

const Layout = props => {

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
                tmpItem._id = Phones.phoneList[Main.selection].current.addToWidgetList(item)
            props.list.push(tmpItem)
            Phones.phoneList[Main.selection].current.forceUpdate()
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            isOverCurrent: monitor.isOver({ shallow: true })
        }),
    });
    console.log(props);
    return (
        <Grid
            container
            direction={props.properties.direction}
            className={"layout base " + props.name.toLowerCase() + (props.visualizer ? " visualizer" : "")}
            wrap={"nowrap"}
            style={isOverCurrent ? {...DisplayWidgetsStyle.Display[props.display](props).style, filter: "brightness(85%)"} : {...DisplayWidgetsStyle.Display[props.display](props).style}}
            onClick={(event) => {
                if (props.disable !== true) {
                    event.stopPropagation();
                    WidgetProperties.getInstance().current?.handleSelect(props._id)
                }
            }}
            onContextMenu={(event => {
                event.preventDefault();
                event.stopPropagation();
                dialog.current.createDialog(<ContextMenu event={event} widget={props}/>)
            })}
            ref={drop}>
            {
                props.list.map(id => {

                    const widget = Phones.phoneList[props.myId].current.findWidgetByID(id._id)

                    if (widget && widget.group === WidgetGroup.MATERIAL) {
                        return (<Widget key={widget._id.toString()} {...widget}/>);
                    } else if (widget && widget.group === WidgetGroup.LAYOUT) {
                        return (<Layout disable={props.disable} myId={props.myId} key={widget._id.toString()} {...widget} {...id}/>);
                    } else return (<Fragment key={'empty'}/>)
                })
            }
        </Grid>
    );
};

export default Layout