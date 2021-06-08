let _buffer = {code:"", import: new Set(), LValue: ""};


const SharedBuffer = {
    addCode: item => {
        _buffer.code += item;

    },
    addImport: item => {

        _buffer.import.add(item);
        console.log("Here is my set");
        console.log(_buffer.import);
        /*for (const v in _importSet.values()) {
            console.log(v);
            _buffer.import += 'import ' + v + '.dart' + "\n";
        }*/

    },
    addLValue: item => {
        _buffer.LValue += item;
    },
    erase: () => {
        _buffer = {code:"", import: new Set(), LValue: ""}
    },
    get: () => {
        return _buffer;
    }
}

Object.freeze(SharedBuffer);
export default SharedBuffer;
