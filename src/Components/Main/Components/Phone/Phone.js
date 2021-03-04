import React, {Fragment} from "react";
import "./Phone.css"
import Layout from "./Components/Layout/Layout";
import {Button} from "@material-ui/core";

class Phone extends React.Component {

    constructor(props) {
        super(props);
        this.state = {widgetList: []};
    }

    getList = () => {
        return this.state.widgetList;
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