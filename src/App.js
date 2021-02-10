import React from 'react';
import {Widgets} from "./WidgetList";
import './App.css';
import Phone from "./Phone";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import Osef from "./osef";

class App extends React.Component {

    render() {
        return (
            <Router>

                <Switch>
                    <Route exact path = "/">
                        <div className="App">
                            <header className="App-header">
                                <DndProvider backend={HTML5Backend}>
                                    <Widgets/>
                                    <Phone/>
                                    <Link to={"/a"}>
                                        <Osef/>
                                    </Link>
                                </DndProvider>
                            </header>
                        </div>
                    </Route>
                    <Route exact path="/a">
                        <Osef/>
                        <Link to={"/"}>
                            back
                        </Link>
                    </Route>
                </Switch>
            </Router>
            /*  */

        );
    }
}

export default App;
