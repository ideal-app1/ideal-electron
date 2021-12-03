import React from "react";
import {MapInteractionCSS} from 'react-map-interaction';
import "./Phones.css"
import Phone from "../Phone/Phone";
import Main from "../../Main";
import JsonManager from "../../Tools/JsonManager";
import Path from "../../../../utils/Path";
import { Grid } from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import AddIcon from '@material-ui/icons/Add';
import PhoneDataObject from "../Phone/DataObject/Phone"

class Phones extends React.Component {

    static phoneList = [
        new PhoneDataObject(),
    ];

    constructor(props) {
        super(props);
        this.state = {
            phoneListLength: Phones.phoneList.length,
        }
    }

    componentDidMount() {

        if (Main.MainProjectPath !== "" && JsonManager.exist(Path.build(Main.MainProjectPath, 'Ideal_config.json'))) {
            let jsonCode = JsonManager.get(Path.build(Main.MainProjectPath, 'Ideal_config.json'));

            jsonCode.view.forEach((phone, key) => {
                if (!Phones.phoneList[key]) {
                    Phones.phoneList.push(new PhoneDataObject());
                    Phones.loadByIndex(key);
                    this.setState({phoneListLength: Phones.phoneList.length});
                }
            });
        }
    }

    static getViews() {
        const views = [];


    }

    static getView(index) {
        // todo faire des truc logique
        return ('View' + index);
    }

    static getRoutes() {
        let result = [];
        Phones.phoneList.map((elem, key) => {
            const view = ('View' + key);
            const path = key === 0 ? "/" : "/" + view;
            result.push({path: path, view: view});
        });
        return result;
    }

    static loadByIndex(index) {
        if (Main.MainProjectPath !== "" && JsonManager.exist(Path.build(Main.MainProjectPath, 'Ideal_config.json'))) {
            let jsonCode = JsonManager.get(Path.build(Main.MainProjectPath, 'Ideal_config.json'));

            if (!Phones.phoneList[index]) {
                Phones.phoneList.push(new PhoneDataObject());
            } else {
                Phones.phoneList[index].setData(jsonCode.view[index]);
            }
        }
    }

    static resetState() {
        Phones.phoneList.map((elem) => {
            elem.resetState();
        });
    }

    render() {
        let data = "";

        if (this.props.phoneId !== null) {
            data = <Phone disable={false} myId={this.props.phoneId} ref={Phones.phoneList[this.props.phoneId].getRef()}/>;
        } else {
            data = <div style={{textAlign: 'center'}}>
                <MapInteractionCSS>
                    <div className={"phones"} style={{alignItems: 'center'}}>
                        {Phones.phoneList.map((elem, key) => {
                            return (
                                <div className={'phone-container'} key={key}>
                                    <Grid
                                        container
                                        className={'phone-toolbar'}
                                        alignItems={'center'}
                                        justify={'space-between'}>
                                        <DeleteIcon onClick={() => {
                                            Phones.phoneList[key].deleteView();
                                            Phones.phoneList.splice(key, 1);
                                            this.setState({ phoneListLength: Phones.phoneList.length });
                                        }}/>
                                        {'View ' + key}
                                        <MoreHorizIcon/>
                                    </Grid>
                                    <div onClick={() => {this.props.select(key);}}>
                                        <Phone disable={true} myId={key} ref={Phones.phoneList[key].getRef()}/>
                                    </div>
                                </div>
                            );
                        })}
                        <AddIcon style={{fontSize: '6rem', marginTop: '90px'}} onClick={() => {
                            Phones.phoneList.push(new PhoneDataObject());
                            this.setState({phoneListLength: Phones.phoneList.length});
                        }}/>
                    </div>
                </MapInteractionCSS>
            </div>;
        }
        return (
            data
        );
    }

}

export default Phones