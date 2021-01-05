const parameterTypes = require("../../types/parameterTypes.js");

class iocAssignable {
    static get $constructor() { return [parameterTypes.name, parameterTypes.parent, "basicClass", parameterTypes.string, parameterTypes.string, parameterTypes.object]; }
    constructor(name, parent, basicClass, stringAssignedA, stringAssignedB, objectAssigned) {
        this.name = name;
        this.parent = parent;
        this.basicClass = basicClass;
        this.stringAssignedA = stringAssignedA;
        this.stringAssignedB = stringAssignedB;
        this.objectAssigned = objectAssigned;
    }
}

module.exports = iocAssignable;