let _buffer = {code:"", LValue: ""};

const SharedBuffer = {
    addCode: item => {
        _buffer.code += item;

    },
    addLValue: item => {
        _buffer.LValue += item;
    },
    erase: () => {
        _buffer = {code:"", LValue: ""}
    },
    get: () => {
        return _buffer;
    }
}

Object.freeze(SharedBuffer);
export default SharedBuffer;
