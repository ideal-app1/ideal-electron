import React, {useState} from "react";
import "./Layout.css"
import {useDrop} from "react-dnd";
import {WidgetType, WidgetGroup} from "../../../../../../utils/WidgetUtils"
import Widget from "../Widget/Widget";
import {Grid} from "@material-ui/core";
import { v4 as uuid } from 'uuid';
import WidgetProperties from "../../../WidgetProperties/WidgetProperties";
import WidgetDropPreview from "../WidgetDropPreview/WidgetDropPreview";

const Layout = props => {

    const [widgetList, setWidgetList] = useState([])

    const [{isOver, isOverCurrent, getItem}, drop] = useDrop({
        accept: WidgetType.LIBRARY,
        drop: (item, monitor) => {
            const didDrop = monitor.didDrop();
            if (didDrop) {
                return;
            }
            const tmpItem = {
                ...item,
                _id: uuid(),
                source: WidgetType.PHONE,
                remove: () => {setWidgetList(widgetList => widgetList.filter(widget => widget !== tmpItem))}
            };
            setWidgetList([...widgetList, tmpItem]);
            if (item.source === WidgetType.PHONE) {
                item.remove();
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            isOverCurrent: monitor.isOver({ shallow: true }),
            getItem: monitor.getItem()
        }),
    });

    return (
        <Grid
            container
            direction={props.properties.direction}
            justify={props.properties.justify}
            alignItems={props.properties.align}
            className={"layout " + props.name}
            wrap={"nowrap"}
            style={isOverCurrent ? {filter: "brightness(85%)"} : {}}
            onClick={(event) => {
                event.stopPropagation()
                console.log("clicked => " + props.name)
                WidgetProperties.getInstance().current.handleSelect(props)
            }}
            ref={drop}>
            {
                widgetList.map(widget => {
                    if (widget.group === WidgetGroup.WIDGET) {
                        return (<Widget key={widget._id.toString()} {...widget}/>);
                    }
                    else if (widget.group === WidgetGroup.LAYOUT) {
                        return (<Layout key={widget._id.toString()} {...widget}/>);
                    }
                })
            }
            {WidgetDropPreview(getItem, isOverCurrent)}
        </Grid>
    );
};


export default Layout