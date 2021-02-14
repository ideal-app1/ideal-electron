import React from 'react';
import {Library} from "./Components/Main/Components/Library/Library";
import './App.css';
import Phone from "./Components/Main/Components/Phone/Phone"
import WidgetProperties from "./Components/Main/Components/WidgetProperties/WidgetProperties";
import Main from "./Components/Main/Main";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import CodeLink from "./Components/CodeLink/CodeLink";

class App extends React.Component {

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/">
                        <Main/>
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
