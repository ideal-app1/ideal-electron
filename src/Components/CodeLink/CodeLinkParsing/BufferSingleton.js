let _buffer = "";

const SharedBuffer = {
    add: item => {
        _buffer += item;
        console.log(_buffer);
    },
    erase: () => {
        _buffer = ""
    }
}

Object.freeze(SharedBuffer);
export default SharedBuffer;
