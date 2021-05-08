import React from 'react';
import './App.css';
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
                    <Route exact path="/codelink/:filepath" component={CodeLink}>
                        <Link to={"/"}>
                            backkkk
                        </Link>
                    </Route>
                </Switch>
            </Router>
            /*  */

        );
    }
}

export default App;
