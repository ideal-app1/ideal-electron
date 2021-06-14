let _buffer = {code:"", import: new Set(), LValue: ""};


const SharedBuffer = {
  addCode: item => {
    _buffer.code += item;

  },
  addImport: item => {
    _buffer.import.add(item);
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
