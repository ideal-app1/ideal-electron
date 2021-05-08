import React from "react";
import {Library} from "./Components/Library/Library";
import Phone from "./Components/Phone/Phone";
import WidgetProperties from "./Components/WidgetProperties/WidgetProperties";
import CodeLink from '../CodeLink/CodeLink';

import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";

import config from "../../flutterCode/config.json";


import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    BrowserRouter
} from "react-router-dom";

import Menu from "./Components/Menu/Menu";
import Phones from "./Components/Phones/Phones";

class Main extends React.Component {

    static MainProjectPath = "";

    constructor(props) {
        super(props);
        Main.MainProjectPath = config.ProjectPathAutoSaved;
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <DndProvider backend={HTML5Backend}>


                        <Library/>
                        <Route exact path="/codelink/:filepath" component={CodeLink}></Route>
                        <Link to={"/codelink/codelink"}>
                            CodeLink
                        </Link>
                        
                        <Phones/>
                        <WidgetProperties ref={WidgetProperties.getInstance()}/>
                        <Menu/>
                    </DndProvider>
                </header>
            </div>
        );
    }
}


export default Main