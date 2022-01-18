import { INodeSlot, LiteGraph } from 'litegraph.js';
import BufferSingleton from '../CodeLinkParsing/BufferSingleton';
import sharedBuffer from '../CodeLinkParsing/BufferSingleton';
import inheritNodeBase from './NodeBase';
import NodeTransferData from './NodeTransferData';

const createFunctionNode = (func, LCanvas, path) => {

    FunctionNode.title = func['name'];
    FunctionNode.description = func['name'];
    FunctionNode.callbackCode = '';
    // Index of the next input
    FunctionNode.doIndex = 0;
    // Index of the do and callback outputs
    FunctionNode.nextIndex = 0;
    FunctionNode.callbackIndex = 1;

    function FunctionNode() {
        inheritNodeBase(FunctionNode, this);
        this.handleInputsOutputs();
        this.properties = { precision: 1 };
        this.isAlreadyComputed = false;
        this.varName = this.makeId(15);
        this.isAPureCallback = true;
        this.setPath();
    }

    FunctionNode.prototype.handleInputsOutputs = function() {
        let nbOfParameters = 0;

        this.addInput(' do', '', { 'shape': LiteGraph.ARROW_SHAPE });
        func['parameters'].forEach((param) => {
            this.addInput(param['name'] + '(' + param['type'] + ')', ''/*param["type"]*/);
            nbOfParameters++;
        });


        this.addOutput('next', LiteGraph.OUTPUT, { 'shape': LiteGraph.ARROW_SHAPE });
        this.addOutput('callback(Function)', LiteGraph.OUTPUT, {
            'shape': LiteGraph.CARD_SHAPE,
            color_on: '#FFA500',
            color_off: '#FFA500'
        });

        if (func['return'] !== 'void')
            this.addOutput(func['return'], ''/*func["return"]*/);
    };

    // Function is called only when the next output is connected
    FunctionNode.prototype.noOtherConnections = function() {
        const outputs = this.outputs;

        if (outputs.length <= 2) {
            return true;
        }

        for (let i = 2; i < outputs.length; i++) {
            if (outputs[i].links !== null)
                return false;
        }
        return true;

    };

    FunctionNode.prototype.onConnectionsChange = function(type, index, isConnected, link, ioSlot) {
        if (!link || type === LiteGraph.INPUT)
            return;
        // If it is neither a callback or a next output
        // Set that the node is a pure callback or not depending of it is connected
        console.log(this.outputs);
        if (index > FunctionNode.callbackIndex)
            this.isAPureCallback = !isConnected;
        else if (index === FunctionNode.nextIndex && isConnected) {
            this.isAPureCallback = false;
        } else if (index === FunctionNode.nextIndex && isConnected === false && this.noOtherConnections()) {
            this.isAPureCallback = true;
        }
    };

    FunctionNode.prototype.createCallback = function() {

        let buffer = 'const dynamic ' + this.varName + ' = ' + func['name'] + ';';
        sharedBuffer.addCode(buffer);
        this.setOutputData(0, this);
    };

    FunctionNode.prototype.getInlineCode = function() {

    };


    FunctionNode.prototype.classicFunction = function() {
        console.log('classic')
        let funcCall = 'final ' + this.varName + ' = ';
        let buffer = this.title + '(';
        const nbOfInputs = func['parameters'].length;
        let node = undefined;

        for (let i = FunctionNode.doIndex + 1; i <= nbOfInputs; i++) {
            node = this.getInputData(i); // Value should be a NodeTransferData instanc
            console.log(node);
            if (node === undefined) {
                buffer += `null,`;
            } else {
                buffer += `${node.data.code}, `;
            }
        }
        buffer += ');';
        this.callbackCode = `final ${this.varName}Callback = () {${buffer}};`;
        if (this.isAPureCallback === false) {
            sharedBuffer.addCode(funcCall + buffer);
        } else {
            sharedBuffer.addCode(this.callbackCode);

        }
        this.setOutputData(0, null);
        this.setOutputData(1, new NodeTransferData(this, { code: `${this.varName}Callback` }));
        this.setOutputData(2, new NodeTransferData(this, { code: this.varName }));

        sharedBuffer.addImport(func['import']);
    };

    const removeCodeBracket = (body) => {
        if (body[0] === '{' && body[body.length - 1] === '}') {
            body = body.slice(1)
            return body.slice(0, body.length - 1)
        }
        return body
    };

    const isInvalidInline = () => {
        return func.return !== 'void' && func.body.search(`\\breturn\\b`) !== -1
    }

    FunctionNode.prototype.InlineFunction = function() {
        console.log('inline');
        const nbOfInputs = func['parameters'].length;
        let buffer = removeCodeBracket(func['body']);
        let node = undefined;
        let currentParam = undefined;

        if (isInvalidInline())
            return this.classicFunction();
        for (let i = FunctionNode.doIndex + 1; i <= nbOfInputs; i++) {
            node = this.getInputData(i); // Value should be a NodeTransferData instance
            currentParam = func.parameters[i - (FunctionNode.doIndex + 1)]?.['name'];
            if (node === undefined || currentParam === undefined) {
                console.log('skip')
               continue;
            }
            console.log(`I replace ${currentParam} with ${node.data.code}`)
            buffer = buffer.replaceAll(new RegExp(`\\b${currentParam}\\b`, 'g'), node.data.code);
        }
        sharedBuffer.addCode(buffer);
    };

    FunctionNode.prototype.InsideFunction = function() {

    };

    FunctionNode.prototype.onExecute = function() {
        let found = false;

        ['InlineFunction', 'InsideFunction'].forEach((annotationName) => {
            if (found === false && this.hasAnnotation(func.annotations, annotationName)) {
                this[annotationName]();
                found = true;
            }
        });
        if (found)
            return;
        this.classicFunction();
    };

    FunctionNode.prototype.setPath = function() {
        if (func['path'].length > 0) {
            path = this.formatPath(func, path);
        } else {
            path = `${path}${func['name']}`;
        }
    };


    LiteGraph.registerNodeType(`${path}${func['name']}`, FunctionNode);
};
export default createFunctionNode;
