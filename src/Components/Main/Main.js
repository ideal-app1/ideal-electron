import React from "react";
import {Library} from "./Components/Library/Library";
import Phone from "./Components/Phone/Phone";
import WidgetProperties from "./Components/WidgetProperties/WidgetProperties";

import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";

import {
    Link
} from "react-router-dom";

class Main extends React.Component {



    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <DndProvider backend={HTML5Backend}>
                        <Library/>
                        <Phone/>
                        <Link to={"/a"}>
                            cya
                        </Link>
                        <WidgetProperties ref={WidgetProperties.getInstance()}/>
                    </DndProvider>
                </header>
            </div>
        );
    }
};


export default Main