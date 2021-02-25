import {LiteGraph} from "litegraph.js";

const createSplitter = (func) => {

    function Splitter() {
        this.realValue = 1;
        this.addProperty("value", 1);
        this.widget = this.addWidget("number", "value", 1, "value");
        this.addInput("play", LiteGraph.ACTION );
        this.addInput("1", undefined);

        this.addOutput("out", undefined);
        //this.properties = {precision: 1};


    }


    Splitter.title = "Splitter";
    Splitter.description = "Splitter";


    Splitter.prototype.onExecute = function () {
        this.addInput("1", undefined);

        console.log("Et alors ? ");
        console.log( this.getPropertyInfo("value"))
    }


    Splitter.prototype.setValue = function(newValue, oldValue)
    {

        if (oldValue > newValue) {
            while (oldValue > newValue) {
                this.removeOutput(oldValue.toString());
                oldValue -= 1;
            }
        } else if (oldValue < newValue) {
            while (oldValue < newValue && oldValue <= 10) {
                console.log("j'add");
                this.addOutput(oldValue.toString(), undefined);
                oldValue += 1;
            }
        }
        console.log("je met la nouvelle value " + newValue)
        this.setProperty("value", newValue);
    }

    Splitter.prototype.onPropertyChanged = function(name, value, old) {
        console.log(name);
        console.log("valeur ? " + Math.ceil(value.toFixed(1)) + " old ? " + old);
        this.setValue(Math.ceil(value.toFixed(1)), old);
        return (true);
    }
    Splitter.prototype.onDrawBackground = function(ctx) {
        //show the current value
        console.log(this.properties["value"]);
        this.inputs[0].label = "haha";

    };
    /*
    Splitter.prototype.setValue = function(v)
    {
        console.log(this);
        console.log(v);
        let oldV = 1

        if (oldV > v) {
            while (oldV > v) {
                this.removeOutput(oldV.toString());
                oldV += 1;
            }
        } else if (oldV < v) {
            while (oldV < v) {
                this.addOutput(oldV.toString(), undefined);
                oldV -= 1;
            }
        }
        this.setProperty("value",v);


    }*/
    LiteGraph.registerNodeType("Custom Utilities/Splitter", Splitter);

}

export default createSplitter