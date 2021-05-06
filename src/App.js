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
// import useToken from './Components/Token/useToken';
// import useLicence from './Components/Licence/useLicence';

function App () {
    // const { token, setToken } = useToken();
    // const { licence, setLicence } = useLicence();

    // const [token, setToken] = useState();
    // const [licence, setLicence] = useState();
    //
    // if (!token || !licence) {
    //     console.log(token, licence);
    //     return <Login setToken={setToken} setLicence={setLicence}/>
    // }

    return (
        <div className={"wrapper"}>
            <Router>
                <Switch>
                    <Route exact path="/">
                        <Main/>
                    </Route>
                    <Route path="/CodeLink">
                        <CodeLink/>
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
