import React, {Fragment} from "react";
import "./Phone.css"
import Layout from "./Components/Layout/Layout";
import {v4 as uuid} from "uuid";
import {WidgetType} from "../../../../utils/WidgetUtils";
import Main from "../../Main";
import Path from '../../../../utils/Path';
import JsonManager from "../../Tools/JsonManager";
import Button from '@material-ui/core/Button';

const clone = require("rfdc/default");

class Phone extends React.Component {

    constructor(props) {
        super(props);
        this._id = uuid()

        this.state = {
            widgetList: [],
            idList: {
                _id: this._id,
                list: []
            },
            // history: {pos: 0, list: []},
            clipboard: {}
        };
    }

    static instance = null;

    static getInstance = () => {
        if (Phone.instance == null)
            Phone.instance = React.createRef();

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
            // history: {pos: 0, list: []},
            clipboard: {}
        })
    }

    componentDidMount() {
        if (Main.MainProjectPath !== "" && JsonManager.exist(Path.build(Main.MainProjectPath, 'Ideal_config.json'))) {
            const jsonCode = JsonManager.get(Path.build(Main.MainProjectPath, 'Ideal_config.json'));
            this.setState(jsonCode);
            this._id = jsonCode.idList._id
        }
    }

    componentDidUpdate(prevProps, prevState) {
        /*console.log(this.state)
        const history = this.state.history;
        if (history.list.length > 5)
            history.shift();
        history.pos = history.list.length;
        history.list.push({...clone(this.state), history: {}})*/
        if (Main.MainProjectPath === "") {
            return;
        }
        const finalWidgetList = this.state;
        console.log(this.state);
        JsonManager.saveThis(finalWidgetList, Path.build(Main.MainProjectPath, "Ideal_config.json"));

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

    itemToAdd = (item) => {
        return {
            ...item,
            _id: uuid(),
            source: WidgetType.PHONE
        }
    }

    addToWidgetList = widget => {
        const item = this.itemToAdd(clone(widget))
        this.state.widgetList.push(item)
        return item._id
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
        if (idItem._id === id)
            return idItem
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
        return this.deepFind(id, this.state.idList);
    }

    removeByID = id => {
        return this.deepRemove(id, this.state.idList);
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

    render() {
        return (
            <Fragment>
                <div className={"phone"}>
                    <Layout
                        _id={this._id}
                        name={"root"}
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
                {/*<Button variant="contained" color="primary" onClick={() => {
                    const history = this.state.history;
                    this.setState({...history.list[history.pos], history: {...history, pos: history.pos - 1}})
                }}>
                    BACK
                </Button>*/}
            </Fragment>
        );
    }
}

export default Phone