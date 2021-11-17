import React, {Fragment} from "react";
import "./Phone.css"
import Layout from "./Components/Layout/Layout";
import Main from "../../Main";
import Path from '../../../../utils/Path';
import JsonManager from "../../Tools/JsonManager";
import Phones from "../Phones/Phones";

const clone = require("rfdc/default");
const {ipcRenderer} = window.require('electron');

class Phone extends React.Component {

    constructor(props) {
        super(props);

        this.historyChange = false;
        this.shortcuts = {
            undo: this.undoHistory,
            redo: this.redoHistory
        };
        ipcRenderer.on('handle-shortcut', (event, arg) => {
            this.shortcuts[arg]?.();
        });
    }

    componentDidMount() {
        Phones.loadByIndex(this.props.myId);
    }

    componentDidUpdate(prevProps, prevState) {
        if (Main.MainProjectPath === "") {
            return;
        }
        Phones.phoneList[this.props.myId].pushHistory();
        const finalWidgetList = Phones.phoneList[this.props.myId].getData();
        let data = JsonManager.get(Path.build(Main.MainProjectPath, "Ideal_config.json"));

        if (data === null) {
            data = {view: []};
        }
        data.view[this.props.myId] = finalWidgetList;
        JsonManager.saveThis(data, Path.build(Main.MainProjectPath, "Ideal_config.json"));
    }

    render() {
        return (
            <Fragment>
                <div className={"phone"}>
                    <div className={"notch"}>
                        <i>Speaker</i>
                        <b>Camera</b>
                    </div>
                    <Layout
                        disable={this.props.disable}
                        myId={this.props.myId}
                        _id={Phones.phoneList[this.props.myId].getData().idList._id}
                        name={"root"}
                        group={"layout"}
                        properties={{
                            direction: "column",
                            justifyContent: "flex-start",
                            align: "flex-start"
                        }}
                        list={Phones.phoneList[this.props.myId].getData().idList.list}
                        display={'Center'}
                        root
                    />
                </div>
            </Fragment>
        );
    }
}

export default Phone
