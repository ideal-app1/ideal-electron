import React from "react";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { TreeView } from '@material-ui/lab';
import { RenderTree } from './Components/RenderTree';

const WidgetTree = (props) => {

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
            defaultExpanded={['root']}
            defaultExpandIcon={<ChevronRightIcon />}
        >
            <RenderTree {...data}/>
        </TreeView>
    )
}

export default WidgetTree