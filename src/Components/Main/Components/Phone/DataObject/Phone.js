import React from "react";
import {v4 as uuid} from "uuid";
import JsonManager from "../../../Tools/JsonManager";
import Path from "../../../../../utils/Path";
import Main from "../../../Main";
import {WidgetType} from "../../../../../utils/WidgetUtils";

const clone = require("rfdc/default");

export default class Phone {
    constructor() {
        this.data = {
            widgetList: [],
            idList: {
                _id: uuid(),
                list: []
            },
            history: {pos: 0, list: []},
            clipboard: {}
        };
        this.phoneRef = React.createRef();
    }

    resetState() {
        this.data = {
            widgetList: [],
            idList: {
                _id: uuid(),
                list: []
            },
            history: {pos: 0, list: []},
            clipboard: {}
        };
        this.historyChange = false;
    }

    deleteView() {
        let data = JsonManager.get(Path.build(Main.MainProjectPath, "Ideal_config.json"));
        data.view.splice(this.props.myId, 1);
        JsonManager.saveThis(data, Path.build(Main.MainProjectPath, "Ideal_config.json"));
    }

    setData(data) {
        if (data) {
            this.data = data;
        }
        return this;
    }

    getData() {
        return this.data;
    }

    pushHistory = () => {
        if (this.historyChange) {
            this.historyChange = false;
            return;
        }
        const history = this.data.history;
        if (history.pos !== 0 && history.pos !== history.list.length - 1) {
            history.list.splice(history.pos + 1);
        }
        if (history.list.length > 10)
            history.list.shift();
        history.pos = history.list.length;
        const tmpState = clone(this.data);
        tmpState.history = {};
        tmpState.clipboard = {};
        history.list.push(tmpState);
    }

    alreadyExist = (self, name) => {
        const searchWidgetList = this.state.widgetList.filter(x => x._id !== self._id);
        for (let i = 0; i < searchWidgetList.length; i++) {
            if (searchWidgetList[i].properties.name.value === name)
                return true;
        }
        return false;
    }

    undoHistory = () => {
        const history = this.data.history;
        if (history.pos <= 0)
            return;
        this.historyChange = true;
        const tmpState = clone(history.list[history.pos - 1]);
        tmpState.history = {...history, pos: history.pos - 1};
        tmpState.clipboard = this.data.clipboard;
        this.data.history = tmpState;
    }

    redoHistory = () => {
        const history = this.data.history;
        if (history.pos >= history.list.length - 1)
            return;
        this.historyChange = true;
        const tmpState = clone(history.list[history.pos + 1]);
        tmpState.history = {...history, pos: history.pos + 1};
        tmpState.clipboard = this.data.clipboard;
        this.data.history = tmpState;
    }

    findWidgetByID = id => {

        for (let i = 0; i < this.data.widgetList.length; i++) {
            if (this.data.widgetList[i]._id === id)
                return this.data.widgetList[i]
        }
    }

    removeWidgetByID = id => {
        for (let i = 0; i < this.data.widgetList.length; i++) {
            if (this.data.widgetList[i]._id === id) {
                this.data.widgetList.splice(i, 1);
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
        console.log(this.data.widgetList);
        item.index = this.data.widgetList.filter(w => w.name === widget.name).lastItem?.index + 1 || 0;
        item.properties.name.value += item.index;
        this.data.widgetList.push(item);
        return item._id;
    }

    deepConstruct = idItem => {
        if (!idItem)
            return null
        let finalListItem = {}
        if (idItem._id !== this.data.idList._id)
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
        const widget = this.deepFind(id, this.data.idList);
        return this.deepFlatten(widget.child);
    }

    findByID = id => {
        if (id === this.data.idList._id)
            return {child: this.data.idList};
        return this.deepFind(id, this.data.idList);
    }

    removeByID = id => {
        if (id === this.data.idList._id)
            return null;
        this.deepRemove(id, this.data.idList);
    }

    moveByID = (id, idDest, list) => {
        const dest = this.deepFind(idDest, this.data.idList)
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

    setClipboard(clipboard) {
        this.data.clipboard = clipboard;
    }

    getWidgetIdList = () => {
        return this.data.idList.list;
    }

    getRef() {
        return this.phoneRef;
    }

    getWidgetList() {
        return this.data.widgetList;
    }

    forceUpdateRef() {
        if (this.phoneRef.current) {
            this.phoneRef.current.forceUpdate();
        }
    }
}