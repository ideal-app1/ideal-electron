import React, {Fragment} from "react";
import "./Phone.css"
import Layout from "./Components/Layout/Layout";
import {v4 as uuid} from "uuid";
import {WidgetType} from "../../../../utils/WidgetUtils";
import Main from "../../Main";
import Path from '../../../../utils/Path';
import JsonManager from "../../Tools/JsonManager";
import Phones from "../Phones/Phones";

const clone = require("rfdc/default");
const {ipcRenderer} = window.require('electron');

class Phone extends React.Component {

    constructor(props) {
        super(props);
        this._id = uuid();
        this.state = {
            widgetList: [],
            idList: {
                _id: this._id,
                list: []
            },
            history: {pos: 0, list: []},
            clipboard: {}
        };
        this.historyChange = false;
        this.shortcuts = {
            undo: this.undoHistory,
            redo: this.redoHistory
        };
        ipcRenderer.on('handle-shortcut', (event, arg) => {
            this.shortcuts[arg]?.();
        });
    }

    resetState() {
        this._id = uuid()
        this.setState({
            widgetList: [],
            idList: {
                _id: this._id,
                list: []
            },
            history: {pos: 0, list: []},
            clipboard: {}
        });
        this.historyChange = false;
    }

    load() {
        const toLoad = Phones.loadByIndex(this.props.myId);
        if (toLoad) {
            this.setState(toLoad);
            this._id = toLoad.idList._id;
        }
    }

    componentDidMount() {
        this.load();
    }

    deleteView() {
        let data = JsonManager.get(Path.build(Main.MainProjectPath, "Ideal_config.json"));
        console.log(data.view);
        data.view.splice(this.props.myId, 1);
        console.log(data.view);
        JsonManager.saveThis(data, Path.build(Main.MainProjectPath, "Ideal_config.json"));
    }

    componentDidUpdate(prevProps, prevState) {
        if (Main.MainProjectPath === "") {
            return;
        }
        this.pushHistory();
        const finalWidgetList = this.state;
        let data = JsonManager.get(Path.build(Main.MainProjectPath, "Ideal_config.json"));

        if (data === null) {
            data = {view: []};
        }
        data.view[this.props.myId] = finalWidgetList;
        console.log('PRINT DATA');
        console.log(data);
        JsonManager.saveThis(data, Path.build(Main.MainProjectPath, "Ideal_config.json"));
    }

    pushHistory = () => {
        if (this.historyChange) {
            this.historyChange = false;
            return;
        }
        const history = this.state.history;
        if (history.pos !== 0 && history.pos !== history.list.length - 1) {
            history.list.splice(history.pos + 1);
        }
        if (history.list.length > 10)
            history.list.shift();
        history.pos = history.list.length;
        const tmpState = clone(this.state);
        tmpState.history = {};
        tmpState.clipboard = {};
        history.list.push(tmpState);
    }

    undoHistory = () => {
        const history = this.state.history;
        if (history.pos <= 0)
            return;
        this.historyChange = true;
        const tmpState = clone(history.list[history.pos - 1]);
        tmpState.history = {...history, pos: history.pos - 1};
        tmpState.clipboard = this.state.clipboard;
        this.setState(tmpState);
    }

    redoHistory = () => {
        const history = this.state.history;
        if (history.pos >= history.list.length - 1)
            return;
        this.historyChange = true;
        const tmpState = clone(history.list[history.pos + 1]);
        tmpState.history = {...history, pos: history.pos + 1};
        tmpState.clipboard = this.state.clipboard;
        this.setState(tmpState);
    }

    findWidgetByID = id => {
        for (let i = 0; i < this.state.widgetList.length; i++) {
            if (this.state.widgetList[i]._id === id)
                return this.state.widgetList[i]
        }
    }

    alreadyExist = (self, name) => {
        const searchWidgetList = this.state.widgetList.filter(x => x._id !== self._id);
        for (let i = 0; i < searchWidgetList.length; i++) {
            if (searchWidgetList[i].properties.name.value === name)
                return true;
        }
        return false;
    }

    removeWidgetByID = id => {
        for (let i = 0; i < this.state.widgetList.length; i++) {
            if (this.state.widgetList[i]._id === id) {
                this.state.widgetList.splice(i, 1);
                return;
            }
        }
    }

    addToWidgetList = (widget, id) => {
        const item = {
            ...clone(widget),
            _id: id || uuid(),
            source: WidgetType.PHONE
        }
        item.index = this.state.widgetList.filter(w => w.name === widget.name).lastItem?.index + 1 || 0;
        item.properties.name.value += item.index;
        this.state.widgetList.push(item);
        return item._id;
    }

    deepConstruct = idItem => {
        if (!idItem)
            return null
        let finalListItem = {}
        if (idItem._id !== this._id)
            finalListItem = this.findWidgetByID(idItem._id)
        finalListItem.list = []
        for (let i = 0; i < idItem.list.length; i++) {
            finalListItem.list.push(this.deepConstruct(idItem.list[i]))
        }
        return finalListItem
    }

    deepFind = (id, idItem) => {
        if (!idItem)
            return null
        for (let i = 0; i < idItem.list.length; i++) {
            if (idItem.list[i]._id === id) {
                return {
                    parent: idItem,
                    child: idItem.list[i]
                };
            } else {
                const res = this.deepFind(id, idItem.list[i])
                if (res != null)
                    return res
            }
        }
    }

    deepRemove = (id, idItem) => {
        if (!idItem)
            return;
        for (let i = 0; i < idItem.list.length; i++) {
            if (idItem.list[i]._id === id) {
                idItem.list.splice(i, 1)
                return;
            } else
                this.deepRemove(id, idItem.list[i])
        }
    }

    deepFlatten = (idItem) => {
        if (!idItem)
            return [];
        let flattenList = [];
        for (let i = 0; i < idItem.list.length; i++) {
            flattenList.push(idItem.list[i]._id);
            flattenList = flattenList.concat(this.deepFlatten(idItem.list[i]))
        }
        return flattenList;
    }

    flattenByID = id => {
        const widget = this.deepFind(id, this.state.idList);
        return this.deepFlatten(widget.child);
    }

    findByID = id => {
        if (id === this._id)
            return {child: this.state.idList};
        return this.deepFind(id, this.state.idList);
    }

    removeByID = id => {
        if (id === this._id)
            return null;
        this.deepRemove(id, this.state.idList);
    }

    moveByID = (id, idDest, list) => {
        const dest = this.deepFind(idDest, this.state.idList)
        for (let i = 0; i < dest.parent.list.length; i++) {
            if (dest.parent.list[i]._id === dest.child._id) {
                const idItem = {
                    _id: id,
                    list: list || []
                }
                dest.parent.list.splice(i, 0, idItem);
                return;
            }
        }
    }

    getWidgetIdList = () => {
        return this.state.idList.list;
    }

    static createRef = () => {
        return React.createRef();
    }

    render() {
        return (
            <Fragment>
                <div className={"phone"}>
                    <Layout
                        disable={this.props.disable}
                        myId={this.props.myId}
                        _id={this._id}
                        name={"root"}
                        group={"layout"}
                        properties={{
                            direction: "column",
                            justifyContent: "flex-start",
                            align: "flex-start"
                        }}
                        list={this.state.idList.list}
                        display={'Center'}
                        root
                    />
                </div>
            </Fragment>
        );
    }
}

export default Phone
