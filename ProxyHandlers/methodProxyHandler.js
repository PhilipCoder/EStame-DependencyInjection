const getMethodParameters = require("../helpers/methodParameters.js");

class methodHandler {
    constructor(methodDefinition, scopedRepo, iocContainerInstance) {
        this.methodDefinition = methodDefinition;
        this.scopedRepo = scopedRepo;
        this.iocContainerInstance = iocContainerInstance;
    }

    apply(target, that, args) {
        let parameters = getMethodParameters(this.methodDefinition, this.iocContainerInstance,this.scopedRepo,null,Array.from(args),null, null)

        return target.bind(that, ...parameters)();
    }
}

module.exports = methodHandler;