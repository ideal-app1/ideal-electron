import React from "react";
import { MapInteractionCSS } from 'react-map-interaction';
import "./Phones.css"
import Phone from "../Phone/Phone";

class Phones extends React.Component {


    render() {
        return (
            <div className={"phones"}>
                <MapInteractionCSS>
                    <Phone/>
                </MapInteractionCSS>
            </div>
        );
    }
}

export default Phones