import React from "react";
import { useDrag, useDrop } from 'react-dnd';
import { WidgetType, WidgetGroup } from '../../../../../../../utils/WidgetUtils';
import Phones from '../../../../Phones/Phones';
import { TreeItem } from '@material-ui/lab';
import WidgetProperties from '../../../../WidgetProperties/WidgetProperties';

export const RenderTree = (props) => {

    const ref = React.useRef(null);

    const [dragging, setDragging] = React.useState(false)

    const [{isOver, isOverCurrent}, drop] = useDrop({
        accept: WidgetType.LIBRARY,
        drop: (item, monitor) => {
            if (monitor.didDrop())
                return;
            if (props.group === WidgetGroup.MATERIAL)
                Phones.actualPhone().moveInListByID(props, item);
            else if (props.group === WidgetGroup.LAYOUT) {
                if (item.source === WidgetType.PHONE)
                    Phones.actualPhone().moveInListByID(props, item);
                else
                    Phones.actualPhone().addToListByID(props, item);
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            isOverCurrent: monitor.isOver({ shallow: true })
        }),
    });

    if (props._id !== 'root') {
        const [{isDragging}, drag] = useDrag({
            item: props,
            isDragging: monitor => {
                if (dragging && monitor.getItem().source === WidgetType.PHONE) {
                    Phones.actualPhone().removeByID(monitor.getItem()._id);
                    setDragging(false);
                }
            },
            begin: () => { setDragging(true) },
            end: (draggedItem, monitor) => {
                const didDrop = monitor.didDrop();
                if (!didDrop) {
                    Phones.actualPhone().getRef().current.componentDidUpdate()
                }
            },
            collect: monitor => ({
                isDragging: monitor.isDragging()
            })
        })
        drag(drop(ref))
    } else {
        drop(ref);
    }

    const hoverOnWidget = () => {
        if (isOverCurrent) {
            Phones.actualPhone().hoverWidget(props._id, () => {
                return isOverCurrent;
            });
        }
    }

    hoverOnWidget();

    return (
        <TreeItem
            className={props._id.toString()}
            ref={ref}
            nodeId={props._id}
            label={props.name || 'Undefined'}
            style={isOverCurrent ? {backgroundColor: 'rgba(255, 255, 255, 0.08)'} : {}}
            onMouseEnter={(event) => {
                event.preventDefault();
                Phones.actualPhone().hoverWidget(props._id, true);
            }}
            onMouseLeave={(event) => {
                event.preventDefault();
                Phones.actualPhone().hoverWidget(props._id, false);
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