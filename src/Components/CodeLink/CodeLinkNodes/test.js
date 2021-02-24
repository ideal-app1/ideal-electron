
const createNode = () => {
//your node constructor class
    function MyAddNode() {
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
    }

    return (MyAddNode)
}
export default createNode