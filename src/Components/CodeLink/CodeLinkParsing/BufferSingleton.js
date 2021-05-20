let _buffer = {code:"", import: "", LValue: ""};
let _importSet = new Set();

const SharedBuffer = {
    addCode: item => {
        _buffer.code += item;

    },
    addImport: item => {
      _importSet.add(item);
      console.log("SALUT")
      console.log(_importSet);
      //_buffer.import = "";
      _importSet.forEach((val) => {
        console.log("print value");
        console.log(val)
      })
        _buffer.import += "import '" + item + "';\n";

        /*for (const v in _importSet.values()) {
            console.log(v);
            _buffer.import += 'import ' + v + '.dart' + "\n";
        }*/

    },
    addLValue: item => {
        _buffer.LValue += item;
    },
    erase: () => {
        _buffer = {code:"", import: '', LValue: ""}
        _importSet.clear();
    },
    get: () => {
        return _buffer;
    }
}

Object.freeze(SharedBuffer);
export default SharedBuffer;
