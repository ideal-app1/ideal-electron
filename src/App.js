import React from 'react';
import {WidgetList} from "./WidgetList";
import './App.css';
import Phone from "./Phone";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";

class App extends React.Component {

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <DndProvider backend={HTML5Backend}>
                        <WidgetList/>
                        <Phone/>
                    </DndProvider>
                </header>
            </div>
        );
    }
}

export default App;
