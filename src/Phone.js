import React from "react";
import "./Phone.css"
import Layout from "./Layout";


const Phone = () => {
    return (
        <div className={"phone-view"}>
            <Layout
                name={"root"}
                direction={"column"}
                justify={"flex-start"}
                alignItems={"flex-start"}/>
        </div>
    );
};

export default Phone