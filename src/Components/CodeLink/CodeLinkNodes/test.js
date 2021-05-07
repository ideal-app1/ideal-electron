import {LGraph, LGraphCanvas, LiteGraph, ContextMenu, IContextMenuItem} from "litegraph.js"

const createNode = () => {
//your node constructor class
    function MyAddNode() {
        this.addInput("Mdr", LiteGraph.ACTION);
        //add some input slots
        this.addInput("A", "int");
        this.addInput("B", "int");
        //add some output slots
        this.addOutput("A+B", "String");
        //add some properties
        this.properties = {precision: 1};
    }

//name to show on the canvas
    MyAddNode.title = "LaSommeHaha";


    MyAddNode.prototype.onConnectionsChange = function (type, index, isConnected, link, ioSlot) {
        console.log("Je suis connecté ? " + isConnected + " du type ? " + type)
        console.log(link)

    }
//function to call when the node is executed
    MyAddNode.prototype.onExecute = function () {
        var m = {
            'coucou': 1,
            'salut': "lol"
        }
        //retrieve data from inputs
        var A = this.getInputData(0);
        if (A === undefined)
            A = 0;
        var B = this.getInputData(1);
        if (B === undefined)
            B = 0;
        //assing data to otputs
        this.setOutputData(0, m);
        console.log("Result + " + (A + B));
        console.log(A)
        this.mdr();
    }

    return (MyAddNode)
}

export default createNode