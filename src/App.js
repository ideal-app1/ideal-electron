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
import CodeLink from "./CodeLink";

class App extends React.Component {

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/">
                        <div className="App">
                            <header className="App-header">
                                <DndProvider backend={HTML5Backend}>
                                    <Widgets/>
                                    <Phone/>
                                    <Link to={"/a"}>
                                        cya
                                    </Link>
                                </DndProvider>
                            </header>
                        </div>
                    </Route>
                    <Route  path="/a">
                        <CodeLink/>
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
