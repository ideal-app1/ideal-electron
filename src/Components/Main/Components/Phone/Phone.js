import React, {Fragment} from "react";
import "./Phone.css"
import Layout from "./Components/Layout/Layout";
import {v4 as uuid} from "uuid";
import {WidgetType} from "../../../../utils/WidgetUtils";
import Project from "../../../Project/Project";
import Path from '../../../../utils/Path';
import JsonManager from "../../Tools/JsonManager";
import Button from '@material-ui/core/Button';

const clone = require("rfdc/default");
const { ipcRenderer } = window.require('electron');

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
            if (this.shortcuts[arg])
                this.shortcuts[arg]();
        });
    }

    static instance = null;

    static getInstance = () => {
        if (Phone.instance == null) {
            Phone.instance = React.createRef();
        }
        return Phone.instance;
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

    componentDidMount() {
        if (Project.ProjectPath !== "" && JsonManager.exist(Path.build(Project.ProjectPath, 'Ideal_config.json'))) {
            const jsonCode = JsonManager.get(Path.build(Project.ProjectPath, 'Ideal_config.json'));
            this.setState(jsonCode);
            this._id = jsonCode.idList._id;
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (Project.ProjectPath === "") {
            return;
        }
        //console.log(this.state);
        this.pushHistory();
        const finalWidgetList = this.state;
        JsonManager.saveThis(finalWidgetList, Path.build(Project.ProjectPath, "Ideal_config.json"));
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
            }
            else {
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
            }
            else
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
            return { child: this.state.idList };
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

    render() {
        return (
            <Fragment>
                <div className={"phone"}>
                    <Layout
                        _id={this._id}
                        name={"root"}
                        group={"layout"}
                        properties={{
                            direction: "column",
                            justify: "flex-start",
                            align: "flex-start"
                        }}
                        list={this.state.idList.list}
                        display={'Center'}
                        root
                    />
                </div>
                <Button variant="contained" color="secondary" onClick={() => {this.resetState()}}>
                    CLEAR
                </Button>
            </Fragment>
        );
    }
}

export default Phone