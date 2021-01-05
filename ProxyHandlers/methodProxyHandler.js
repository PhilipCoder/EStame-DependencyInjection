class methodHandler {
    constructor(methodDefinition, scopedRepo, iocContainerInstance) {
        this.methodDefinition = methodDefinition;
        this.scopedRepo = scopedRepo;
        this.iocContainerInstance = iocContainerInstance;
    }

    apply(target, that, args) {
        let parameters = [];
        for (let i = 0; i < this.methodDefinition.length; i++) {
            let parameterValue = typeof this.methodDefinition[i] === "string" ?
                this.iocContainerInstance.__get(this.methodDefinition[i], this.scopedRepo) :
                args.length > i ?
                    args[i] :
                    undefined;
            parameters.push(parameterValue);
        }
        return target.bind(that, ...parameters)();
    }
}

module.exports = methodHandler;