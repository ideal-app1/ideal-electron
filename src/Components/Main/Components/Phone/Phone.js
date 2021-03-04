import React, {Fragment} from "react";
import "./Phone.css"
import Layout from "./Components/Layout/Layout";
import JsonManager from "./Tools/JsonManager";
import {Button} from "@material-ui/core";
import Main from "../../Main";

class Phone extends React.Component {

    constructor(props) {
        super(props);
        this.state = {widgetList: []};
    }

    getList = () => {
        return this.state.widgetList;
    }

    componentDidUpdate(prevProps, prevState)
    {

        JsonManager.saveThis(this.state, Main.MainProjectPath + "\\Ideal_config.json");
    }

    setList = list => {
        this.setState({widgetList: list});
    }

    render() {
        return (
            <Fragment>
                <div className={"phone"}>
                    <Layout
                        name={"root"}
                        properties={{
                            direction: "column",
                            justify: "flex-start",
                            align: "flex-start"
                        }}
                        getList={this.getList}
                        updateList={() => this.forceUpdate()}
                        setList={this.setList}
                    />
                </div>
                <Button onClick={console.log(this.getList())}>Test</Button>
            </Fragment>
        );
    }
}

export default Phone