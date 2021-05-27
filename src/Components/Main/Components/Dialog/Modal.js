import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import './Modal.css';

import Loading from './Components/Loading/Loading'

class Modal extends React.Component {

    constructor(props) {
        super(props);
        this.state = { open: false, modal: null, callback: null }
    }

    static instance = null;

    static getInstance = () => {
        if (Modal.instance == null)
            Modal.instance = React.createRef();
        return Modal.instance;
    }

    handleClose = res => {
        if (res)
            this.state.callback(res)
        this.setState({open: false, modal: null, callback: null});
    };

    setModal = (modal, handleClose) => {
        this.setState({open: true, modal: modal, callback: handleClose})
    }

    createModal = async (modal) => {
        return await new Promise((resolve, reject) => {
            this.setModal(modal, (res) => {
                if (res.dir === '')
                    reject(res)
                resolve(res)
            })
        })
    }

    setLoading = bool => {
        this.setState({...this.state, loading: bool})
    }

    render() {
        if (this.state.loading)
            return (<Loading/>)
        return (
            <Dialog open={this.state.open} onClose={() => {this.handleClose()}}>
                {this.state.modal}
            </Dialog>
        );
    }
}

export default Modal