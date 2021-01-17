const parameterTypes = require("../../types/parameterTypes.js");
class methodInjection {
    constructor() {
    }

    get $addValue() { return [undefined, undefined,parameterTypes.container] }
    addValue(a, b, container) {
        return { value: a + b, container };
    }
}

module.exports = methodInjection;