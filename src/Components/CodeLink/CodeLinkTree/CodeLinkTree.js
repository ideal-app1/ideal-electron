import React from "react";
import {Button, Modal} from "react-bootstrap";

class CodeLinkTree extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false,
        };
    }

    handleClose = () => {
        this.setState({show: false});
    }

    handleShow = () => {
        this.setState({show: true});
    }

    render() {
        return (
            <div className={"CodeLinkTree"}>
                <Button variant="secondary" onClick={this.handleShow}>
                    CodeLinkTree
                </Button>

                <Modal
                    size="lg"
                    show={this.state.show}
                    onHide={this.handleClose}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>CodeLink Tree</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        In progress
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default CodeLinkTree