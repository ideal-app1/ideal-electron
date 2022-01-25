import React, { useCallback, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { WidgetType, WidgetGroup } from '../../../../../../../utils/WidgetUtils';
import Phones from '../../../../Phones/Phones';
import { TreeItem } from '@material-ui/lab';
import WidgetProperties from '../../../../WidgetProperties/WidgetProperties';
import ContextMenu from '../../../../Dialog/Components/ContextMenu/ContextMenu';
import Dialog from '../../../../Dialog/Dialog';

export const RenderTree = (props) => {

    const ref = React.useRef(null);

    const dialog = Dialog.getInstance();

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

    const [{isDragging}, drag] = useDrag({
        item: props,
        canDrag: props._id !== WidgetType.ROOT,
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

    drag(drop(ref));

    useEffect(() => {
        Phones.actualPhone().hoverWidget(props._id, isOverCurrent);
    }, [isOverCurrent])

    const onMouseHover = () => {
        const hoverEvent = (event, state) => {
            event.preventDefault();
            Phones.actualPhone().hoverWidget(props._id, state);
        }
        return {
            onMouseEnter: (event) => { hoverEvent(event, true) },
            onMouseLeave: (event) => { hoverEvent(event, false) }
        }
    }

    return (
        <TreeItem
            className={props._id.toString()}
            ref={ref}
            nodeId={props._id}
            label={props.name || 'Undefined'}
            style={isOverCurrent ? {backgroundColor: 'rgba(255, 255, 255, 0.08)'} : {}}
            {...onMouseHover()}
            onLabelClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                WidgetProperties.getInstance().current.handleSelect(props._id);
            }}
            onContextMenu={(event => {
                event.preventDefault();
                event.stopPropagation();
                dialog.current.createDialog(<ContextMenu event={event} widget={props}/>)
            })}
        >
            {Array.isArray(props.list) ? props.list.map((node) => <RenderTree key={node._id.toString()} {...node} />) : null}
        </TreeItem>
    );
};