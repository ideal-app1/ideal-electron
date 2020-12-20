import React, {useState} from "react";
import "./Layout.css"
import {useDrop} from "react-dnd";
import {WidgetType, WidgetClass} from "./utils/WidgetUtils"
import Widget from "./Widget";
import {Grid} from "@material-ui/core";
import { v4 as uuid } from 'uuid';

const Layout = props => {

    const [widgetList, setWidgetList] = useState([])

    const [{isOver, isOverCurrent}, drop] = useDrop({
        accept: WidgetType.LIST,
        drop: (item, monitor) => {
            const didDrop = monitor.didDrop();
            if (didDrop) {
                return;
            }
            const tmpItem = {
                ...item,
                _id: uuid(),
                type: WidgetType.VUE
            };
            setWidgetList([...widgetList, tmpItem]);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            isOverCurrent: monitor.isOver({ shallow: true })
        }),
    });

    return (
        <Grid
            container
            direction={props.direction}
            justify={props.justify}
            alignItems={props.align}
            className={"layout " + props.name}
            wrap={"nowrap"}
            style={isOverCurrent ? {filter: "brightness(85%)"} : {}}
            ref={drop}>
            {
                widgetList.map(widget => {
                    if (widget.class === WidgetClass.WIDGET) {
                        return (<Widget key={widget._id.toString()} {...widget}/>);
                    }
                    else if (widget.class === WidgetClass.LAYOUT) {
                        return (<Layout key={widget._id.toString()} {...widget}/>);
                    }
                })
            }
        </Grid>
    );
};


export default Layout