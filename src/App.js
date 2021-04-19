import React, { useState } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import './App.css';
import Main from "./Components/Main/Main";
import Login from "./Components/Login/Login"
import CodeLink from "./Components/CodeLink/CodeLink";

function App () {
    const [token, setToken] = useState();
    const [licence, setLicence] = useState();

    if (!token || !licence) {
        return <Login setToken={setToken} setLicence={setLicence}/>
    }

    return (
        <div className={"wrapper"}>
            <Router>
                <Switch>
                    <Route exact path="/">
                        <Main/>
                    </Route>
                    <Route path="/a">
                        <CodeLink/>
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
