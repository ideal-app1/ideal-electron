import React from "react";
import "./Phone.css"
import Layout from "./Layout";


const Phone = () => {
    return (
        <div className={"phone"}>
            <Layout
                name={"root"}
                properties={{
                    direction: "column",
                    justify: "flex-start",
                    align: "flex-start"
                }}
            />
        </div>
    );
};

export default Phone