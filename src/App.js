import React from 'react';
import './App.css';
import Main from "./Components/Main/Main";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    BrowserRouter
} from "react-router-dom";
import CodeLink from "./Components/CodeLink/CodeLink";

class App extends React.Component {

    

    render() {
        return (
            <BrowserRouter>
                
                    <Switch>
                        <Route exact path="/">
                            <Main/>
                        </Route>
                        <Route exact path="/codelink/:filepath" component={CodeLink}>
                        </Route>
                    </Switch>
                
            </BrowserRouter>
            /*  */

        );
    }
}

export default App;
