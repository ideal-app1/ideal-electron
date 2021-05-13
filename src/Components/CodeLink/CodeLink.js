import React from "react";
import {LGraph, LGraphCanvas, LiteGraph, ContextMenu, IContextMenuItem, serializedLGraph} from "litegraph.js"
import './CodeLink.css';
import "./litegraph.css"
import createFunctionNode from './CodeLinkNodes/FunctionNode'
import createValue from "./CodeLinkNodes/ConstValueNode"
import createMethodNode from "./CodeLinkNodes/MethodNode";
import CodeLinkTree from "./CodeLinkTree/CodeLinkTree";
import {Button, Col, Container, Form, FormControl, Nav, Navbar, NavDropdown, Row} from 'react-bootstrap';
import {Route} from "react-router";
import CodeLinkNodeLoader from "./CodeLinkNodeLoader";

const fs = window.require("fs")
const app = window.require('electron').remote.app;


class CodeLink extends React.Component {

    #graph = new LGraph();

    constructor(props) {
        super(props)
        console.log("props de codelink")
        console.log(this.props.match.params.filepath)
        console.log(this.props.match.params.idwidget)
    }    
    


    addNodes = () => {
        //LiteGraph.registerNodeType("basic/sumation", createNode() );
    }

    init = () => {
        console.log("Ici commence Init function")
        this.Lcanvas = new LGraphCanvas(this.canvas, this.#graph);
        let currentpath = this.props.match.params.filepath;
        console.log(currentpath)
        const data = fs.readFileSync(currentpath,
            {encoding:'utf8', flag:'r'});
  
        // Display the file data
        if (data.length == 0) {
            LiteGraph.clearRegisteredTypes()
            this.addNodes()
            fs.readFile('data.json', 'utf-8', CodeLinkNodeLoader.loadEveryKnownNodes);
        } else {
            const buffer = JSON.parse(data)
            this.#graph.configure(buffer, false)

            LiteGraph.clearRegisteredTypes()
            this.addNodes()
            fs.readFile('data.json', 'utf-8', CodeLinkNodeLoader.loadEveryKnownNodes);
        }
    }

    savegraph(event) {
        console.log("Début de la save")
        let currentpath = this.props.match.params.filepath;
        
        let output = JSON.stringify(event, null, 4);
        fs.writeFileSync(currentpath, output);
    }

    render() {
        console.log("View codelink")
        return (
            <div>
                <Navbar fixed="top" bg="dark" variant="dark">
                    <Navbar.Brand>CodeLink</Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link href="/">Home view</Nav.Link>
                        <NavDropdown title="Tools" id="collasible-nav-dropdown">
                            <NavDropdown.Item >
                                <CodeLinkTree/>
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">Tmp</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Button variant={"warning"} style={{'marginRight': '2rem'}} onClick={() => {
                        console.log("mdr")
                        this.#graph.runStep(1)
                    }}>
                        Exec
                    </Button>
                    <Button variant={"warning"} style={{'marginRight': '2rem'}} onClick={() => {
                        console.log("SaveFile")
                        this.savegraph(this.#graph.serialize(serializedLGraph))
                    }}>
                        Save
                    </Button>
                    <Form inline>
                        <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                        <Button variant="outline-info">Search</Button>
                    </Form>
                </Navbar>
                <Container fluid className={"CodeLink-Content"}>
                    <Row className={"CodeLink-canvas"}>
                        <Col className={"CodeLink-canvas-Box"}>
                            <canvas id="myCanvas" width={1920} height={1080} ref={(canvas) => {
                                this.canvas = canvas;
                                this.init()
                            }}/>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default CodeLink
