import React, {Fragment} from "react";
import "./Layout.css"
import {useDrop} from "react-dnd";
import {WidgetGroup, WidgetType} from "../../../../../../utils/WidgetUtils"
import Widget from "../Widget/Widget";
import {Grid} from "@material-ui/core";
import {v4 as uuid} from 'uuid';
import WidgetProperties from "../../../WidgetProperties/WidgetProperties";
import WidgetDropPreview from "../WidgetDropPreview/WidgetDropPreview";

const Layout = props => {

    const [{isOver, isOverCurrent, getItem}, drop] = useDrop({
        accept: WidgetType.LIBRARY,
        drop: (item, monitor) => {
            if (monitor.didDrop()) {
                return;
            }
            props.setList([...props.getList(), itemToAdd(item)])
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

    const itemToAdd = (item) => {
        const tmpItem = {
            ...item,
            _id: uuid(),
            source: WidgetType.PHONE,
            widgetList: [],
            getList: function () {
                return this.widgetList;
            },
            updateList: props.updateList,
            setList: function (list) {
                tmpItem.widgetList = list
                this.updateList()
            },
            update: function (updateItem) {
                const newList = props.getList()
                newList[newList.findIndex(w => w._id === this._id)] = updateItem
                props.setList(newList)
            },
            remove: function () {
                props.setList(props.getList().filter(w => w._id !== this._id))
            }
        };
        return tmpItem
    }

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
                WidgetProperties.getInstance().current.handleSelect(props)
            }}
            ref={drop}>
            {
                props.getList().map(widget => {
                    if (widget.group === WidgetGroup.WIDGET) {
                        return (<Widget key={widget._id.toString()} {...widget}/>);
                    }
                    else if (widget.group === WidgetGroup.LAYOUT) {
                        return (<Layout key={widget._id.toString()} {...widget}/>);
                    }
                    else return (<Fragment/>)
                })
            }
            {WidgetDropPreview(getItem, isOverCurrent)}
        </Grid>
    );
};


export default Layout