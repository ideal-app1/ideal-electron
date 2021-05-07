import React from "react";
import {Library} from "./Components/Library/Library";
import Phone from "./Components/Phone/Phone";
import WidgetProperties from "./Components/WidgetProperties/WidgetProperties";
import CodeLink from '../CodeLink/CodeLink';

import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";


import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    BrowserRouter
} from "react-router-dom";

import Menu from "./Components/Menu/Menu";

class Main extends React.Component {

    static MainProjectPath = "";


    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <DndProvider backend={HTML5Backend}>


                        <Library/>
                        <Phone/>
                        <Route exact path="/codelink/:filepath" component={CodeLink}></Route>
                        <Link to={"/codelink/codelink"}>
                            CodeLink
                        </Link>
                        
                        <WidgetProperties ref={WidgetProperties.getInstance()}/>
                        <Menu/>
                    </DndProvider>
                </header>
            </div>
        );
    }
}


export default Main