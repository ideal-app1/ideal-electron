import React from "react";
import { useDrop } from 'react-dnd';
import { WidgetType, WidgetGroup } from '../../../../../../../utils/WidgetUtils';
import Phones from '../../../../Phones/Phones';
import Main from '../../../../../Main';
import { TreeItem } from '@material-ui/lab';
import WidgetProperties from '../../../../WidgetProperties/WidgetProperties';

export const RenderTree = (props) => {

    const [{isOver, isOverCurrent}, drop] = useDrop({
        accept: WidgetType.LIBRARY,
        drop: (item, monitor) => {
            if (monitor.didDrop())
                return;
            if (props.group === WidgetGroup.MATERIAL)
                Phones.phoneList[Main.selection].moveInListByID(props, item);
            else if (props.group === WidgetGroup.LAYOUT)
                Phones.phoneList[Main.selection].addToListByID(props, item);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            isOverCurrent: monitor.isOver({ shallow: true })
        }),
    });

    const hoverOnWidget = () => {
        if (isOverCurrent) {
            Phones.phoneList[Main.selection].hoverWidget(props._id, () => {
                return isOverCurrent;
            });
        }
    }

    hoverOnWidget();

    return (
        <TreeItem
            className={props._id.toString()}
            ref={drop}
            nodeId={props._id}
            label={props.name || 'Undefined'}
            style={isOverCurrent ? {backgroundColor: 'rgba(255, 255, 255, 0.08)'} : {}}
            onMouseEnter={(event) => {
                event.preventDefault();
                Phones.phoneList[Main.selection].hoverWidget(props._id, true);
            }}
            onMouseOut={(event) => {
                event.preventDefault();
                Phones.phoneList[Main.selection].hoverWidget(props._id, false);
            }}
            onLabelClick={(event) => {
                event.preventDefault();
                WidgetProperties.getInstance().current.handleSelect(props._id);
            }}
        >
            {Array.isArray(props.list) ? props.list.map((node) => <RenderTree key={node._id.toString()} {...node} />) : null}
        </TreeItem>
    );
};