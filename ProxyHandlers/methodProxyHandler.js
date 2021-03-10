const getMethodParameters = require("../helpers/methodParameters.js");
const getMethodInterceptor = require("../helpers/methodInterceptors.js");

class methodHandler {
    constructor(methodDefinition, scopedRepo, iocContainerInstance, methodInterceptorDefinition) {
        this.methodDefinition = methodDefinition;
        this.scopedRepo = scopedRepo;
        this.iocContainerInstance = iocContainerInstance;
        this.methodInterceptorDefinition = methodInterceptorDefinition;
        this.methodInterceptors = getMethodInterceptor(methodInterceptorDefinition, iocContainerInstance, null);
    }

    apply(target, that, args) {
        let parameters = getMethodParameters(this.methodDefinition, this.iocContainerInstance,this.scopedRepo,null,Array.from(args),null, null,that.__namespace).parameters;
        for (const interceptor of this.methodInterceptors){
            if (!interceptor.intercept && typeof interceptor.intercept !== "function") throw 'Invalid interceptor detected';
            const interceptorResult = interceptor.intercept.bind(interceptor, ...parameters)();
            if (interceptorResult){
                return interceptorResult;
            }
        }
        return target.bind(that, ...parameters)();
    }
}

module.exports = methodHandler;