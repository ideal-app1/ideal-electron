import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import './App.css';
import Main from "./Components/Main/Main";
import Login from "./Components/Login/Login"
import CodeLink from "./Components/CodeLink/CodeLink";
import authService from "./service/auth-service";

async function authentication() {
    let noErr = true;

    if (!navigator.onLine)
        return authService.offlineAuthChecking();

    try {
        console.log("start auth");
        await authService.refreshTokens();
        console.log("end auth");
    } catch (err) {
        console.log("erroreee: ", err);
        noErr = false;
    }
    console.log("BAGARRE ?", noErr);
    return noErr;
}

function App () {
    let authenticated = authentication();

    console.log("authenticated", authenticated);
    if (!authenticated) {
        console.log("LOGIINNN");
        return <Login/>
    }
    else {
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
}

export default App;
