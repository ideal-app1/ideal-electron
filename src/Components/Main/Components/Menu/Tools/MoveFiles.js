import React from "react";
import Path from "../../../../../utils/Path"

const fs = window.require('fs');


function moveFiles(source, dest, ext) {
    if (!source || !dest)
        return;
    let files = fs.readdirSync(source)
    if (ext)
        files = files.filter(f => f.includes('.' + ext))
    fs.rmdirSync(dest, { recursive: true });
    fs.mkdirSync(dest)
    files.forEach(file => {
        fs.copyFileSync(Path.build(source, file), Path.build(dest, file))
    })
}

export default moveFiles