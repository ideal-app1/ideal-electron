class CodeProperties {
    #codeName = ""
    #codeID = ""
    #code = ""
    #output = ""
    #inputs = []

    constructor(codeJSONObject) {
        this.#codeName = codeJSONObject.codeName;
        this.#codeID = codeJSONObject.codeID;
        this.#code = codeJSONObject.code;
        this.#output = codeJSONObject.output;
        this.#inputs = codeJSONObject.inputs;
    }
}