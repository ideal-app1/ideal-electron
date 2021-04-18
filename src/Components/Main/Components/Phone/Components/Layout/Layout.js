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
            if (item.source === WidgetType.PHONE) {
                item.remove()
            }
            const tmpList = [...props.getList()]
            const tmpObj = itemToAdd(item)
            console.log('drop in layout')
            tmpList.push(tmpObj)
            props.setList(tmpList)

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
                return tmpItem.widgetList;
            },
            updateList: props.updateList,
            setList: function (list) {
                tmpItem.widgetList = list
                tmpItem.updateList()
            },
            getParentList: function () {
                return props.getList()
            },
            setParentList: function (list) {
                props.setList(list)
            },
            move: function (item) {
                const tmpList = item.getParentList()
                const pos = tmpList.findIndex(w => w._id === item._id)
                const tmpItem = {
                    ...this,
                    getParentList: item.getParentList,
                    setParentList: item.setParentList
                }
                tmpList.splice(pos, 0, tmpItem)
            },
            update: function (updateItem) {
                const newList = this.getParentList()
                newList[newList.findIndex(w => w._id === this._id)] = updateItem
                this.setParentList(newList)
            },
            remove: function () {
                this.setParentList(this.getParentList().filter(w => w._id !== this._id))
            }
        };
        return tmpItem
    }

    return (
        <Grid
            container
            direction={props.properties.direction}
            justify={props.properties.justify.value ? props.properties.justify.value : props.properties.justify}
            alignItems={props.properties.align.value ? props.properties.align.value : props.properties.align}
            className={"layout " + props.name}
            wrap={"nowrap"}
            style={isOverCurrent ? {...props.display().style, filter: "brightness(85%)"} : {...props.display().style}}
            onClick={(event) => {
                event.stopPropagation()
                WidgetProperties.getInstance().current.handleSelect(props)
            }}
            ref={drop}>
            {
                props.getList().map(widget => {
                    if (widget.group === WidgetGroup.MATERIAL) {
                        return (<Widget key={widget._id.toString()} {...widget}/>);
                    }
                    else if (widget.group === WidgetGroup.LAYOUT) {
                        return (<Layout key={widget._id.toString()} {...widget}/>);
                    }
                    else return (<Fragment/>)
                })
            }
        </Grid>
    );
};

//{WidgetDropPreview(getItem, isOverCurrent)}

export default Layout