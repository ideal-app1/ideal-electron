import React from 'react';

class Path extends React.Component {

    static Sep = "/";
    static CopyCmd = "cp";

    constructor(props) {
        super(props);
        console.log('test');
        if (window.navigator.platform === "Win32") {
            Path.CopyCmd = 'copy';
            Path.Sep = '\\';
        }
    }

    static build = (...values) => {
        let res = values[0];
        for (let i = 1; i < values.length; i++) {
            res = res.concat(Path.Sep, values[i]);
        }
        return res;
    }

}

export default Path