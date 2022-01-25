import React from "react";
import {v4 as uuid} from "uuid";
import JsonManager from "../../../Tools/JsonManager";
import Path from "../../../../../utils/Path";
import Main from "../../../Main";
import { WidgetGroup, WidgetType } from '../../../../../utils/WidgetUtils';
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
            clipboard: {},
            visualiser: false
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
            clipboard: {},
            visualiser: false
        };
        this.historyChange = false;
    }

    deleteView(myId) {
        let data = JsonManager.get(Path.build(Main.MainProjectPath, "Ideal_config.json"));
        data.view.splice(myId, 1);
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
        const searchWidgetList = this.data.widgetList.filter(x => x._id !== self._id);
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

    deepDeconstruct = idItem => {
        if (!idItem)
            return null
        let finalListItem = {
            _id: idItem?._id,
            list: []
        }
        for (let i = 0; i < idItem.list.length; i++) {
            finalListItem.list.push(this.deepDeconstruct(idItem.list[i]))
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

    deepCompare = (nodeA, nodeB) => {
        for (let i = 0; i < nodeA.list.length || i < nodeB.list.length; i++) {
            if (nodeA.list[i]?._id !== nodeB.list[i]?._id)
                return false;
            if (!this.deepCompare(nodeA.list[i], nodeB.list[i]))
                return false;
        }
        return true;
    }

    treeTransform = () => {
        return this.deepConstruct(this.data.idList)
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

    moveByID = (nodeId, destNodeId) => {
        const dest = this.deepFind(destNodeId, this.data.idList)
        for (let i = 0; i < dest.parent.list.length; i++) {
            if (dest.parent.list[i]._id === dest.child._id) {
                const nodeToMove = {
                    _id: nodeId,
                    list: []
                }
                dest.parent.list.splice(i, 0, nodeToMove);
                return;
            }
        }
    }

    moveInByID = (node, destNodeId) => {
        const dest = this.deepFind(destNodeId, this.data.idList)
        for (let i = 0; i < dest.parent.list.length; i++) {
            if (dest.parent.list[i]._id === dest.child._id) {
                const nodeList = this.deepDeconstruct(node);
                const nodeToMove = {
                    _id: node._id,
                    list: nodeList.list || []
                }
                dest.child.list.push(nodeToMove)
                return;
            }
        }
    }

    moveInListByID = (node, newNode) => {
        if (newNode.applied) {
            const tmpNode = this.addToWidgetList(newNode);
            this.moveByID(tmpNode, node._id);
            const nodeApplied = this.findByID(tmpNode);
            const nodeToApply = this.findByID(node._id);
            nodeApplied.child.list.push(nodeToApply.child);
            nodeApplied.parent.list = nodeApplied.parent.list.filter(x => x._id !== node._id);
            this.forceUpdateRef();
        } else if (newNode.source === WidgetType.PHONE) {
            if (newNode.group === WidgetGroup.MATERIAL)
                this.moveByID(newNode._id, node._id);
            else if (newNode.group === WidgetGroup.LAYOUT)
                this.moveInByID(newNode, node._id);
        } else {
            const itemID = this.addToWidgetList(newNode);
            this.moveByID(itemID, node._id);
        }
        this.getRef().current.componentDidUpdate();
        this.forceUpdateRef();
    }

    addToListByID = (node, newNode) => {
        const tmpNode = { list: [] };
        if (newNode.source === WidgetType.PHONE)
            tmpNode._id = newNode._id;
        else
            tmpNode._id = this.addToWidgetList(newNode);
        this.findByID(node._id).child.list.push(tmpNode);
        this.forceUpdateRef();
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

    forceUpdateRef() {
        if (this.phoneRef.current) {
            this.phoneRef.current.forceUpdate();
        }
    }

    hoverWidget(id, stopHover) {
        const widget = this.findWidgetByID(id);
        if (!widget)
            return;
        for (let i = 0; i < this.data.widgetList.length; i++) {
            this.data.widgetList[i].hover = false;
        }
        widget.hover = stopHover;
        this.forceUpdateRef();
    }

    selectWidget(widget) {
        for (let i = 0; i < this.data.widgetList.length; i++) {
            this.data.widgetList[i].selected = false;
        }
        widget.selected = true;
        this.forceUpdateRef();
    }

    setVisualiser() {
        this.data.visualiser = !this.data.visualiser;
        this.forceUpdateRef();
    }

    getVisualiser() {
        return this.data.visualiser;
    }
}