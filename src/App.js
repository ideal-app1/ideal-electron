import React, {useState} from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import './App.css';
import Main from "./Components/Main/Main";
import Login from "./Components/Login/Login"
import CodeLink from "./Components/CodeLink/CodeLink";
import authService from "./service/auth-service";

async function authentication({setAuthenticated}) {
    try {
        await authService.authVerification();
        setAuthenticated(true);
    } catch (err) {
        console.log(err);
        setAuthenticated(false);
    }
}

function App () {
/*    const [authenticated, setAuthenticated] = useState();

    (async () => await authentication({setAuthenticated}))();

    if (authenticated === undefined) {
        return (<div> <p>Loading</p> </div>);
    }

    if (!authenticated) {
        return <Login setAuthenticated={setAuthenticated} />
    }
*/
    return (
        <div className={"wrapper"}>
            <Router>
                <Switch>
                    <Route exact path="/">
                        <Main/>
                    </Route>
                    <Route exact path="/codelink/:id" component={CodeLink}/>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
