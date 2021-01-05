const parameterTypes = require("../../types/parameterTypes.js");

class modelAssignable {
    static get $constructor() { return [parameterTypes.parent, "basicClass", parameterTypes.function, parameterTypes.name]; }
    constructor( parent, basicClass, functionAssigned, name) {
        this.parent = parent;
        this.basicClass = basicClass;
        this.functionAssigned = functionAssigned;
        this.name = name;
    }
}

module.exports = modelAssignable;