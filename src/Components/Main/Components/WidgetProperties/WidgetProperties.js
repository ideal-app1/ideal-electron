import React, { Fragment } from 'react';
import './WidgetProperties.css';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { PropType, WidgetGroup } from '../../../../utils/WidgetUtils';
import { Route } from 'react-router-dom';
import Main from '../../Main';
import Path from '../../../../utils/Path';
import MenuFunctions from '../../Tools/MenuFunctions';
import Phones from "../Phones/Phones";
import { Grid, InputAdornment } from '@material-ui/core';

import propSize from './Components/PropSize'

import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import propTextField from './Components/PropTextField';
import propNumField from './Components/PropNumField';
import propCheckBox from './Components/PropCheckBox';
import propComboBox from './Components/PropComboBox';
import propFile from './Components/PropFile';
import propAlignment from './Components/PropAlignment';

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
        const widget = Phones.phoneList[Main.selection].current.findWidgetByID(id);
        console.log(Phones.phoneList);
        console.log(id);
        console.log(Main.selection);
        if (!widget)
            return;
        this.setState({ widget: widget })
    }

    unsetState = () => {
        this.setState({ widget: null })
    }

    updateState = (prop, value) => {
        prop.value = value
        this.forceUpdate()
        Phones.phoneList[Main.selection].current.forceUpdate()
    }

    widgetPropType = prop => {

        let propMap = {
            [PropType.TEXTFIELD]: propTextField,
            [PropType.NUMFIELD]: propNumField,
            [PropType.CHECKBOX]: propCheckBox,
            [PropType.COMBOBOX]: propComboBox,
            [PropType.FILE]: propFile,
            [PropType.ALIGNMENT]: propAlignment,
            [PropType.SIZE]: propSize
        }
        return propMap[prop.type]?.(prop, this.updateState) || prop?.toString()
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
        this.state.widget.codelink = Path.build(Main.MainProjectPath, ".ideal_project", "codelink", this.state.widget._id);
        let fullPath = Path.build(this.state.widget.codelink, this.state.widget._id + '.json');
        return;

        fs.mkdirSync(this.state.widget.codelink, {recursive: true});
        this.createFile(fullPath)
    }

    codeLinkButton = () => {
        return (
            <Grid item style={{marginTop: '15px'}}>
                <Route render={({ history}) => (
                    <Button className="codelink-button"
                            variant="contained"
                            color="primary"
                            onClick={() => {

                                console.log(`PUSH `);
                                console.log(this.state.widget)
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

    onSelection = () => {
        if (this.state.widget) {
            this.onCodelink()
            return (
              <Fragment>
                  <Grid item className={'GridSubheader-root'}>{this.state.widget.name}</Grid>
                  <Grid
                      container
                      item
                      direction={'row'}
                      alignItems={'center'}
                      justifyContent={'space-between'}>
                      <div className={"property-name-" + this.state.widget.group}>group</div>
                      {this.state.widget.group}
                  </Grid>
                  <Divider/>
                  {
                      Object.entries(this.state.widget.properties).map(([key, value]) => {
                          if (value.type !== PropType.HIDDEN) {
                              return (
                                  <Fragment key={this.state.widget._id + key}>
                                      <Grid
                                          container
                                          item
                                          direction={'row'}
                                          alignItems={'center'}
                                          justifyContent={'space-between'}>
                                          <div className={"property-name-" + this.state.widget.group}>{key}</div>
                                          {this.widgetPropType(value)}
                                      </Grid>
                                      <Divider/>
                                  </Fragment>
                              );
                          }
                      })
                  }
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
