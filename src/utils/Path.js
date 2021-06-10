import React from 'react';

class Path {

    static Sep = "/";
    static CopyCmd = "cp";

    constructor() {
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