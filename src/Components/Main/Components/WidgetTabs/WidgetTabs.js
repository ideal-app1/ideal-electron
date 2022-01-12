import React, { Fragment, useRef, useState } from 'react';
import './WidgetTabs.css';
import Button from '@material-ui/core/Button';
import { Library } from '../Library/Library';
import WidgetTree from './Components/WidgetTree/WidgetTree';
import { Grid } from '@material-ui/core';
import Phones from '../Phones/Phones';
import Main from '../../Main';

class WidgetTabs extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 0,
            data: {list: []},
            expanded: []
        }
    }

    static instance = null;

    static getInstance = () => {
        if (WidgetTabs.instance == null)
            WidgetTabs.instance = React.createRef();
        return WidgetTabs.instance;
    }

    handleTab = (tab) => {
        if (this.state.selectedTab === tab)
            return;
        this.setState({selectedTab: tab});
    }

    updateTree = (newTree) => {
        const listComp = Phones.actualPhone().deepCompare(newTree, this.state.data);
        if (listComp)
            return;
        const expandedList = Phones.actualPhone().deepFlatten(newTree);
        this.setState({data: newTree, expanded: expandedList});
    }

    render () {
        return (
            <div id={"widget-tabs"}>
                <Grid container alignItems={'center'} justifyContent={'center'} direction={'row'} style={{marginBottom: "10px"}}>
                    <Button onClick={() => this.handleTab(0)}>Library</Button>
                    <Button onClick={() => this.handleTab(1)}>Widget Tree</Button>
                </Grid>
                <Library style={{display: this.state.selectedTab === 1 ? 'none' : 'inherit'}}/>
                <WidgetTree
                    style={{display: this.state.selectedTab === 0 ? 'none' : 'inherit'}}
                    data={this.state.data} expanded={this.state.expanded}
                />
            </div>

        )
    }
}

export default WidgetTabs