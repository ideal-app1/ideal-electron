import React, {useState} from 'react';
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from '@material-ui/core/styles';

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
    // const [authenticated, setAuthenticated] = useState();
    //
    // (async () => await authentication({setAuthenticated}))();
    //
    // if (authenticated === undefined) {
    //     return (<div> <p>Loading</p> </div>);
    // }
    //
    // if (!authenticated) {
    //     return <Login setAuthenticated={setAuthenticated} />
    // }

    const darkTheme = createTheme({
        palette: {
            type: 'dark',
        },
    });

    return (
        <ThemeProvider theme={darkTheme}>
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
        </ThemeProvider>
    );
}

export default App;
