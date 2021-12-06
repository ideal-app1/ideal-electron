import React from 'react';

class Path {

    static Sep = window.navigator.platform === "Win32" ? '\\' : "/";
    static CopyCmd = window.navigator.platform === "Win32" ? 'copy' : "cp";

    static build = (...values) => {
        let res = values[0];
        for (let i = 1; i < values.length; i++) {
            if (values[i].length === 0)
                continue
            res = res.concat(Path.Sep, values[i]);
        }
        return res;
    }

    static splice = (path, index) => {
        const pathSplit = path.split(Path.Sep);
        let res = pathSplit[0];
        for (let i = 1; i < pathSplit.length; i++) {
            if (index !== -1 && i >= index)
                break;
            if (index === -1 && i >= pathSplit.length - 1)
                break;
            res = res.concat(Path.Sep, pathSplit[i]);
        }
        return res;
    }
}

export default Path