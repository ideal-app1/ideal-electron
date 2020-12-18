import React, {useState} from "react";
import "./Layout.css"
import {useDrop} from "react-dnd";
import {WidgetType, WidgetClass} from "./utils/WidgetUtils"
import Widget from "./Widget";
import {Grid} from "@material-ui/core";
import { v4 as uuid } from 'uuid';

const Layout = props => {

    const [widgetList, setWidgetList] = useState([])

    const [{isOver}, drop] = useDrop({
        accept: WidgetType.LIST,
        drop: (item, monitor) => {
            const didDrop = monitor.didDrop();
            if (didDrop) {
                return;
            }
            const tmpItem = {
                    _id: uuid(),
                    type: WidgetType.VUE,
                    name: item.name,
                    class: item.class,
                    direction: item.direction,
                    justify: item.justify,
                    align: item.align
                };
            setWidgetList([...widgetList, tmpItem]);
            console.log(widgetList)
        },
        collect: (monitor) => ({
            isOver: monitor.isOver({ shallow: false }),
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
            ref={drop}>
            {
                widgetList.map(widget => {
                    console.log(this, widgetList)
                    if (widget.class === WidgetClass.WIDGET) {
                        return (
                            <Widget
                                key={widget._id.toString()}
                                _id={widget._id}
                                name={widget.name}
                                class={widget.class}
                                type={widget.type}
                            />
                        );
                    }
                    else if (widget.class === WidgetClass.LAYOUT) {
                        return (
                            <Layout
                                key={widget._id.toString()}
                                _id={widget._id}
                                name={widget.name}
                                class={widget.class}
                                type={widget.type}
                                direction={widget.direction}
                                justify={widget.justify}
                                alignItems={widget.align}
                            />
                        );
                    }
                    return (<div/>);
                })
            }
        </Grid>
    );
};



export default Layout