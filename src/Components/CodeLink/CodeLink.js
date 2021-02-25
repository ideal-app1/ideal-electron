import React from "react";
import {LGraph, LGraphCanvas, LiteGraph} from "litegraph.js"
import "./litegraph.css"

function Addition(a,b) {
    return a + b;
}

function NewNode() {
    LiteGraph.wrapFunctionAsNode("CodeLink/Addition", Addition,["Number","Number"],"Number");
}

class CodeLink extends React.Component {

    funct = () => {
        NewNode();
        var graph = new LGraph();

        this.Lcanvas = new LGraphCanvas(this.canvas, graph);

        var node_const = LiteGraph.createNode("basic/const");
        node_const.pos = [200, 200];
        graph.add(node_const);
        node_const.setValue(4.5);

        var node_watch = LiteGraph.createNode("basic/watch");
        node_watch.pos = [700, 200];
        graph.add(node_watch);

        node_const.connect(0, node_watch, 0);

        graph.start()
    }

    render() {
        return (
            <div>
                <canvas id="mycanvas" height={1080} width={1920} ref={(canvas) => {
                    this.canvas = canvas;
                    this.funct()
                }

                }/>
            </div>

        );
    }
};


export default CodeLink
