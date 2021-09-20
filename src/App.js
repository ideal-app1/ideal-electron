import React, {useState} from 'react';
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import './App.css';
import Login from "./Components/Login/Login"
import authService from "./service/auth-service";
import Project from "./Components/Project/Project";

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
    /*const [authenticated, setAuthenticated] = useState();

    (async () => await authentication({setAuthenticated}))();

    if (authenticated === undefined) {
        return (<div> <p>Loading</p> </div>);
    }

    if (!authenticated) {
        return <Login setAuthenticated={setAuthenticated} />
    }*/

    const darkTheme = createMuiTheme({
        palette: {
            type: 'dark',
        },
    });

    return (
        <ThemeProvider theme={darkTheme}>
            <div className={"wrapper"}>
                <Project ref={Project.getInstance()}/>
            </div>
        </ThemeProvider>
    );
}

export default App;
