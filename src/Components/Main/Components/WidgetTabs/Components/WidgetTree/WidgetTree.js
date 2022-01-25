import React from "react";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { TreeView } from '@material-ui/lab';
import { RenderTree } from './Components/RenderTree';
import { WidgetGroup, WidgetType } from '../../../../../../utils/WidgetUtils';

const WidgetTree = (props) => {

    const [expanded, setExpanded] = React.useState([]);
    const [selected, setSelected] = React.useState([]);

    React.useEffect(() => {
        setExpanded([WidgetType.ROOT, ...props.expanded]);
    }, [props.expanded]);

    const handleToggle = (event, nodeIds) => {
        setExpanded(nodeIds);
    };

    const handleSelect = (event, nodeIds) => {
        setSelected(nodeIds);
    };

    const data = {
        _id: WidgetType.ROOT,
        type: WidgetType.ROOT,
        group: WidgetGroup.LAYOUT,
        name: 'Scaffold',
        list: props.data.list,
        root: true
    }

    return (
        <TreeView
            style={{
                ...props.style,
                height: 110,
                flexGrow: 1,
                maxWidth: 400,
            }}
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            expanded={expanded}
            selected={selected}
            onNodeToggle={handleToggle}
            onNodeSelect={handleSelect}
        >
            <RenderTree {...data}/>
        </TreeView>
    )
}

export default WidgetTree