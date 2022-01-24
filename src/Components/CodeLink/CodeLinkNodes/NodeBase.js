
function makeid(length) {
    var result           = [];
    var characters       = 'abcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result.push(characters.charAt(Math.floor(Math.random() *
            charactersLength)));
    }
    return result.join('');
}


function isOutputACallback(array) {
    for (const value in array) {
        if (value === false)
            return false;
    }
    return true;
}


function getCallbackData(node, inputName) {
    if (node.nodeType !== "FunctionNode" ||
        inputName.toLowerCase().search('func') === -1)
        return node.varName;
    else {
        return `() {${node.callbackCode};}`;
    }
}



const inheritNodeBase = (func, node) => {
    func.prototype.makeId = makeid;
    func.prototype.callbackTracker = [];
    func.prototype.isOutputACallback = isOutputACallback;
    func.prototype.notACallbackCounter = 0;
    func.prototype.getCallbackData = getCallbackData;
    func.prototype.hasAnnotation = hasAnnotation;
    node.nodeType = func.name;


    function formatPath(node, originalPath) {
        return originalPath;
        return path.replaceAll('#BEGINING_PATH', originalPath)
                   .replaceAll('#VARIABLE_NAME', node['name'])

    }

    function hasAnnotation(annotations, annotationName) {
        let found = false;

        annotations?.forEach((annotation) => {
            console.log(annotation.name, annotationName)
            if (annotation.name === annotationName)
                found = true;
        });
        return found;
    }

    func.prototype.formatPath = formatPath;
}


export default inheritNodeBase