import React from "react";
import {MapInteractionCSS} from 'react-map-interaction';
import "./Phones.css"
import Phone from "../Phone/Phone";
import Button from "@material-ui/core/Button";
import Main from "../../Main";
import JsonManager from "../../Tools/JsonManager";
import Path from "../../../../utils/Path";

class Phones extends React.Component {

    static phoneList = [
        Phone.createRef(),
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
            console.log(jsonCode);

            jsonCode.view.map((phone, key) => {
                if (!Phones.phoneList[key]) {
                    Phones.phoneList.push(Phone.createRef());
                    this.setState({phoneListLength: Phones.phoneList.length});
                }
            });
        }
    }

    static loadByIndex(index) {
        if (Main.MainProjectPath !== "" && JsonManager.exist(Path.build(Main.MainProjectPath, 'Ideal_config.json'))) {
            let jsonCode = JsonManager.get(Path.build(Main.MainProjectPath, 'Ideal_config.json'));

            if (!Phones.phoneList[index]) {
                Phones.phoneList.push(Phone.createRef());
            } else {
                return (jsonCode.view[index]);
            }
        }
        return null;
    }

    static resetState() {
        Phones.phoneList.map((elem) => {
            elem.current.resetState();
        });
    }

    render() {
        console.log(Phones.phoneList);
        console.log(Main.selection);
        let data = "";

        if (this.props.phoneId !== null) {
            data = <Phone disable={false} myId={this.props.phoneId} ref={Phones.phoneList[this.props.phoneId]}/>;
        } else {
            data = <MapInteractionCSS>
                <div className={"phones"}>
                    {Phones.phoneList.map((elem, key) => {
                        return (<div className={"phone-container"}>
                            <div onClick={() => {
                                this.props.select(key);
                            }}>
                                <Phone disable={true} myId={key} ref={elem}/>
                            </div>
                            <Button variant="contained" color="secondary" onClick={() => {
                                Phones.phoneList[key].current.deleteView();
                                Phones.phoneList.splice(key, 1);
                                this.setState({phoneListLength: Phones.phoneList.length});
                            }}>
                                Delete
                            </Button>
                        </div>);
                    })}
                </div>
                <Button variant="contained" color="secondary" onClick={() => {
                    Phones.phoneList.push(Phone.createRef());
                    this.setState({phoneListLength: Phones.phoneList.length});
                }}>
                    New
                </Button>
            </MapInteractionCSS>;
        }
        return (
            data
        );
    }
}

export default Phones