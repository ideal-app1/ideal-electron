import React from "react";
import {LGraph, LGraphCanvas, LiteGraph, ContextMenu, IContextMenuItem} from "litegraph.js"
import './CodeLink.css';
import "./litegraph.css"
import createNode from "./CodeLinkNodes/test"
import createBasicFunction from './CodeLinkNodes/BasicUserFunction'
import createValue from "./CodeLinkNodes/Value"
import createSplitter from "./CodeLinkNodes/Splitter";
import CodeLinkTree from "./CodeLinkTree/CodeLinkTree";
import {Link, Route} from "react-router-dom";
import {Button, Col, Container, Form, FormControl, Nav, Navbar, Row} from 'react-bootstrap';

const fs = window.require("fs")

function Addition(a,b) {
    return a + b;
}

class CodeLink extends React.Component {


    #graph = new LGraph();

    createConstValueNodes = (constValue) => {

        function ConstantNumber() {
            this.addOutput("value", constValue["type"]);
            this.addProperty("value", constValue["value"]);
            this.widget = this.addWidget(constValue["type"] === "int" ? "number" : constValue["type"],"value",constValue["value"],"value");
            this.widgets_up = true;
            this.size = [180, 30];
        }

        ConstantNumber.title = constValue["type"] + " " + constValue["name"];
        ConstantNumber.desc = constValue["type"] + " " + constValue["name"];

        ConstantNumber.prototype.onExecute = function() {
            this.setOutputData(0, parseFloat(this.properties["value"]));
        };

        ConstantNumber.prototype.getTitle = function() {
            if (this.flags.collapsed) {
                return this.properties.value;
            }
            return this.title;
        };

        ConstantNumber.prototype.setValue = function(v)
        {
            this.setProperty("value",v);
        }
        LiteGraph.registerNodeType("Custom/const/" + constValue["name"], ConstantNumber);
    }

    createEveryNodes = (err, data) => {
        const parsed = JSON.parse(data);

        parsed["funcs"].forEach(createBasicFunction);
        parsed["constValues"].forEach(createValue);
        createSplitter();

    }

    addNodes = () => {
        LiteGraph.registerNodeType("basic/sumation", createNode() );
    }

    init = () => {

        this.Lcanvas = new LGraphCanvas(this.canvas, this.#graph);
        LiteGraph.clearRegisteredTypes()
       /* const node1 = LiteGraph.createNode("basic/const")
        node1.pos  = [100, 100];
        this.#graph.add(node1)

        const node2 = LiteGraph.createNode("basic/const");
        node2.pos = [200, 200];
        this.#graph.add(node2)

        var node_watch = LiteGraph.createNode("basic/watch");

        node_watch.pos = [0, 0];

        this.#graph.add(node_watch);
        this.addNodes()
        this.sum = LiteGraph.createNode("basic/sumation");
        this.sum.pos = [500, 500];

        node1.connect(0, this.sum, 0);
        node2.connect(0, this.sum, 1);
*/
        this.addNodes()
        this.sum = LiteGraph.createNode("basic/sumation");
        this.sum.pos = [500, 500];
        this.#graph.add(this.sum);
        fs.readFile('data.json', 'utf-8', this.createEveryNodes);
        //this.#graph.start()
    }

    render() {
        return (
            <div>
                <Navbar fixed="top" bg="dark" variant="dark">
                    <Navbar.Brand>CodeLink</Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link href="/">Home view</Nav.Link>
                    </Nav>
                    <Button variant={"warning"} style={{'marginRight': '2rem'}} onClick={() => {
                        console.log("mdr")
                        this.#graph.runStep(1)
                    }}>
                        Exec
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