const singletonRepo = require("./singletonRepo.js");
const iocTypes = require("./types/ioc.js");
const classProxyHandler = require("./classProxyHandler.js");
const parameterTypes = require("./types/parameterTypes.js");

const getAssignedArgumentIndex = (type, parameters, constructorDefinition) => {
    for (let i = 0; i < parameters.length; i++) {
        if (parameters[i] === undefined && constructorDefinition[i] === parameterTypes[type]) {
            return i;
        }
    }
    throw `Index not found`;
}

const getParametersAssigned = (assignedArguments, constructorDefinition, parameters) => {
    assignedArguments.forEach(assignedArgument => {
        let parameterIndex = getAssignedArgumentIndex(typeof assignedArgument, parameters, constructorDefinition);
        parameters[parameterIndex] = assignedArgument;
    });
};

class constructProxyHandler {
    constructor(iocType, namespace, scopedRepo, iocContainerInstance, parent, name, assignedArguments) {
        this.construct = (target, args, newTarget) => {
            let parameters = null;
            if (target.$constructor) {
                parameters = [];
                for (let i = 0; i < target.$constructor.length; i++) {
                    let parameterValue = undefined;
                    if (typeof target.$constructor[i] === "string") {
                        parameterValue = iocContainerInstance.__get(target.$constructor[i], scopedRepo);
                    } else if (args.length > i) {
                        parameterValue = args[i];
                    } else if (target.$constructor[i] === parameterTypes.parent) {
                        parameterValue = parent;
                    } else if (target.$constructor[i] === parameterTypes.name) {
                        parameterValue = name;
                    }
                    parameters.push(parameterValue);
                }
                if (assignedArguments) getParametersAssigned(assignedArguments, target.$constructor, parameters);
            } else {
                parameters = args;
            }
            delete this.construct;
            let proxyTarget = null;
            switch (iocType) {
                case iocTypes.instanced:
                    proxyTarget = new target(...parameters);
                    break;
                case iocTypes.scoped:
                    scopedRepo[namespace] = scopedRepo[namespace] || new target(...parameters);
                    proxyTarget = scopedRepo[namespace];
                    break;
                case iocTypes.singleton:
                    singletonRepo[namespace] = singletonRepo[namespace] || new target(...parameters);
                    proxyTarget = singletonRepo[namespace];
                    break;
                default:
                    throw "Invalid IOC type specified.";
            }

            let result = new Proxy(proxyTarget, new classProxyHandler(scopedRepo, iocContainerInstance, namespace, parent));
            this.construct = this._construct;
            return result;
        }
        this._construct = this.construct;
    }
}

module.exports = constructProxyHandler;