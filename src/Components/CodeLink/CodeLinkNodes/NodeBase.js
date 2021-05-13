
function makeid(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
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


const inheritNodeBase = (func) => {
    func.prototype.makeId = makeid;
    func.prototype.callbackTracker = [];
    func.prototype.isOutputACallback = isOutputACallback;

    function addNewEntry(value) {
        func.prototype.callbackTracker.push(value);
    }

    function removeAnEntry(valueToRemove) {
        let index = 0;

        for (const value in func.prototype.callbackTracker) {
            if (value === valueToRemove) {
                func.prototype.callbackTracker.splice(index, 1);
                return;
            }
            index++;
        }
    }

    func.prototype.addNewEntry = addNewEntry;
    func.prototype.removeAnEntry = removeAnEntry;
}

export default inheritNodeBase