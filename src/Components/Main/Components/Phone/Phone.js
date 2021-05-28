import React, {Fragment} from "react";
import "./Phone.css"
import Layout from "./Components/Layout/Layout";
import {v4 as uuid} from "uuid";
import {WidgetType} from "../../../../utils/WidgetUtils";
import Main from "../../Main";
import { MapInteractionCSS } from 'react-map-interaction';
import JsonManager from "../../Tools/JsonManager";
import Button from "@material-ui/core/Button";
import {light} from "@material-ui/core/styles/createPalette";
const clone = require("rfdc/default")
const path = require("path")

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
            //history: []
            //clipboard: {}
        };
    }

    //TODO
    /*
    - Add list of 10 previous states
    - Add undo redo
    - Add context menu for copy cut paste
     */

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
        })
    }

    componentDidMount() {
        if (Main.MainProjectPath !== "" && JsonManager.exist(Main.MainProjectPath + Main.Sep + 'Ideal_config.json')) {
            const jsonCode = JsonManager.get(Main.MainProjectPath + Main.Sep + 'Ideal_config.json');

            this.setState(jsonCode);
            this._id = jsonCode.idList._id
        }
    }

    componentDidUpdate(prevProps, prevState) {
        //this.state.buffer.push(clone(this.state))
        if (Main.MainProjectPath === "") {
            return;
        }
        const finalWidgetList = this.state
        JsonManager.saveThis(finalWidgetList, Main.MainProjectPath + Main.Sep + "Ideal_config.json");

    }

    findWidgetByID = id => {
        for (let i = 0; i < this.state.widgetList.length; i++) {
            if (this.state.widgetList[i]._id === id)
                return this.state.widgetList[i]
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

    findByID = id => {
        return this.deepFind(id, this.state.idList)
    }


    removeByID = id => {
        this.deepRemove(id, this.state.idList)
    }

    moveByID = (id, idDest) => {
        const dest = this.deepFind(idDest, this.state.idList)
        for (let i = 0; i < dest.parent.list.length; i++) {
            if (dest.parent.list[i]._id === dest.child._id) {
                const idItem = {
                    _id: id,
                    list: []
                }
                dest.parent.list.splice(i, 0, idItem)
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
                    />
                </div>
                {/*<Button variant="contained" color="primary" onClick={() => {
                    this.setState(this.state.buffer[this.state.buffer.length - 2])
                }}>
                    BACK
                </Button>*/}
            </Fragment>
        );
    }
}

export default Phone