import React, { Fragment } from 'react';
import './WidgetProperties.css';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import { PropType } from '../../../../utils/WidgetUtils';
import { Route } from 'react-router-dom';
import Main from '../../Main';
import Path from '../../../../utils/Path';
import MenuFunctions from '../../Tools/MenuFunctions';
import Phones from "../Phones/Phones";
import { Grid } from '@material-ui/core';

import PropTextField from './Components/PropTextField';
import PropNumField from './Components/PropNumField';
import PropCheckBox from './Components/PropCheckBox';
import PropComboBox from './Components/PropComboBox';
import PropFile from './Components/PropFile';
import PropAlignment from './Components/PropAlignment';
import PropSize from './Components/PropSize'
import PropVarName from './Components/PropVarName';
import PropsGroupItem from './Tools/PropsGroupItem';
import PropsGridItem from './Tools/PropsGridItem';

const fs = window.require('fs');
const { ipcRenderer } = window.require('electron');


class WidgetProperties extends React.Component {

    constructor(props) {
        super(props);
        this.state = { widget: null };
        const menuFunc = new MenuFunctions();
        this.shortcuts = {
            cut: menuFunc.cut,
            copy: menuFunc.copy,
            paste: menuFunc.paste
        };
        ipcRenderer.on('handle-shortcut', (event, arg) => {
            if (this.state.widget)
                this.shortcuts[arg]?.(this.state)
        });
    }

    static instance = null;

    static getInstance = () => {
        if (WidgetProperties.instance == null)
            WidgetProperties.instance = React.createRef();
        return WidgetProperties.instance;
    }

    handleSelect = id => {
        const widget = Phones.actualPhone().findWidgetByID(id);
        if (!widget)
            return;
        Phones.actualPhone().selectWidget(widget);
        this.setState({ widget: widget })
    }

    unsetState = () => {
        this.setState({ widget: null })
    }

    updateState = (prop, value) => {
        prop.value = value
        this.forceUpdate()
        Phones.actualPhone().forceUpdateRef()
    }

    widgetPropType = (prop, name) => {
        const props = {
            widget: this.state.widget,
            name: name,
            prop: prop,
            updateState: this.updateState
        }
        let propMap = {
            [PropType.TEXTFIELD]: <PropTextField {...props}/>,
            [PropType.COLOR]: <PropTextField {...props}/>,
            [PropType.NUMFIELD]: <PropNumField {...props}/>,
            [PropType.CHECKBOX]: <PropCheckBox {...props}/>,
            [PropType.COMBOBOX]: <PropComboBox {...props}/>,
            [PropType.FILE]: <PropFile {...props}/>,
            [PropType.ALIGNMENT]: <PropAlignment {...props}/>,
            [PropType.SIZE]: <PropSize {...props}/>,
            [PropType.VAR]: <PropVarName {...props}/>,
        }
        return propMap[prop.type] || <div>{prop?.toString()}</div>
    }

    createFile(path) {
        if (fs.existsSync(path)) {
            return;
        }
        fs.appendFile(path, null, { flag: 'wx' }, function (err) {
            if (err) throw err;
        });
    }

    onCodelink = () => {

        this.state.widget.codelink = Path.build(Main.MainProjectPath, ".ideal_project", "codelink", `View${Main.selection}`, this.state.widget._id, );
        //let fullPath = Path.build(this.state.widget.codelink, this.state.widget._id + '.json');
        //fs.mkdirSync(this.state.widget.codelink, {recursive: true});
        //this.createFile(fullPath)
    }

    codeLinkButton = () => {
        return (
            <Grid item style={{marginTop: '15px'}}>
                <Route render={({ history}) => (
                    <Button className="codelink-button"
                            variant="contained"
                            color="primary"
                            onClick={() => {

                                history.push({
                                    pathname: '/codelink/' + this.state.widget._id,
                                    state: {
                                        _id: this.state.widget._id,
                                        name: this.state.widget.name,
                                        variableName: this.state.widget.properties.name,
                                        path: this.state.widget.codelink
                                    }
                                })
                            }}>
                        CodeLink
                    </Button>
                )} />
            </Grid>
        );
    }

    isInPropsList = (key) => {
        let tmpPropList = [];
        this.state.widget.propsLayout?.map(propGroup => {
            tmpPropList = tmpPropList.concat(propGroup.items);
        });
        return tmpPropList.find(x => x === key)
    }

    propsDisplay = () => {
        return (
            <Fragment>
                {
                    Object.entries(this.state.widget.properties)
                        .filter(([_, value]) => value.type !== PropType.HIDDEN)
                        .filter(([key, _]) => !this.isInPropsList(key))
                        .filter(([key, _]) => key !== 'name')
                        .map(([key, value]) => <PropsGridItem
                                key={this.state.widget._id + key}
                                prop={value}
                                name={key}
                                widgetPropType={this.widgetPropType}
                            />
                        )
                }
                {
                    this.state.widget.propsLayout?.map(propGroup =>
                        <PropsGroupItem
                            key={this.state.widget._id + propGroup.groupName}
                            group={propGroup}
                            widget={this.state.widget}
                            widgetPropType={this.widgetPropType}
                        />
                    )
                }
            </Fragment>
        )
    }

    onSelection = () => {
        if (this.state.widget) {
            this.onCodelink()
            return (
              <Fragment>
                  <Grid item className={'GridSubheader-root'}>{this.state.widget.name}</Grid>
                  <Grid item className={'property-item-name'} key={this.state.widget._id + 'name'}>
                      {this.widgetPropType(this.state.widget.properties['name'])}
                  </Grid>
                  <Divider/>
                  {this.propsDisplay()}
                  {this.codeLinkButton()}
              </Fragment>
            );
        } else
            return (<div id={'no-selection'}>No Selection</div>);
    }

    render () {

        return (
          <Grid
              container
              direction={'column'}
              className={"widget-properties"}>
              {this.onSelection()}
          </Grid>
        )
    }
}

export default WidgetProperties
