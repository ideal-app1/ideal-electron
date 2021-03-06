import React from 'react';
import "./Loading.css";
import Loader from 'react-loader-spinner';

const Loading = () => {

    return (
        <div className={"loading"}>
            <Loader
                className={"loader"}
                type="TailSpin"
                color="#FFF"
                height={100}
                width={100}
            />
        </div>
    );
}

export default Loading