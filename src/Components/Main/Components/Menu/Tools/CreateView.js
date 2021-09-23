import React from "react";
import Path from "../../../../../utils/Path";

const viewTemplateCode = require('../../../../../flutterCode/View.dart');
const fs = window.require('fs');


function createView(dest, name) {
    if (!dest) {
        console.log('Could not create dart file ' + name)
    }
    const createdViewCode = viewTemplateCode.replaceAll('ideal', name);
    fs.writeFileSync(Path.build(dest, name + '.dart'), createdViewCode);
}

export default createView