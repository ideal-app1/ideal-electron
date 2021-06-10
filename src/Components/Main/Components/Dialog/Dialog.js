import React from 'react';

class Dialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = { dialog: null }
    }

    static instance = null;

    static getInstance = () => {
        if (Dialog.instance == null)
            Dialog.instance = React.createRef();
        return Dialog.instance;
    }

    setDialog = (dialog, handleClose) => {
        this.setState({
            dialog: React.cloneElement(dialog, { handleClose: handleClose })
        });
    }

    unsetDialog = () => {
        this.setState({dialog: null});
    }

    createDialog = async (dialog) => {
        return await new Promise((resolve, reject) => {
            this.setDialog(dialog, (res) => {
                if (res && res.dir !== '')
                    resolve(res);
                this.unsetDialog();
            })
        })
    }

    render() {
        return (this.state.dialog);
    }
}

export default Dialog