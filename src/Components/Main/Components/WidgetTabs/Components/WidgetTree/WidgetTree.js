import React from "react";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { TreeView } from '@material-ui/lab';
import { RenderTree } from './Components/RenderTree';

const WidgetTree = (props) => {

    const [expanded, setExpanded] = React.useState([]);
    const [selected, setSelected] = React.useState([]);

    React.useEffect(() => {
        setExpanded(['root', ...props.expanded]);
    }, [props.expanded]);

    const handleToggle = (event, nodeIds) => {
        setExpanded(nodeIds);
    };

    const handleSelect = (event, nodeIds) => {
        setSelected(nodeIds);
    };

    const data = {
        _id: 'root',
        key: 'root',
        name: 'Scaffold',
        list: props.data.list
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