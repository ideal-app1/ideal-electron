import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import './Modal.css';

const Modal = props => {

    const modal = React.cloneElement(props.modal, { handleClose: props.handleClose });

    return (
        <Dialog open={true} onClose={() => {props.handleClose()}}>
            {modal}
        </Dialog>
    );
}

export default Modal