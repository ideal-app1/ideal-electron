import React, {Fragment, useState} from "react";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { TreeItem, TreeView } from '@material-ui/lab';
import WidgetProperties from '../../../WidgetProperties/WidgetProperties';
import { useDrop } from 'react-dnd';
import { WidgetType } from '../../../../../../utils/WidgetUtils';
import Phones from '../../../Phones/Phones';
import Main from '../../../../Main';
import { RenderTree } from './Components/RenderTree';

const WidgetTree = (props) => {

    console.log(props.data);

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