const parameterTypes = require("../types/parameterTypes.js");

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
        let parameterIndex = getAssignedArgumentIndex(Array.isArray(assignedArgument) ? "array" : typeof assignedArgument, parameters, constructorDefinition);
        parameters[parameterIndex] = assignedArgument;
    });
};


function getMethodParameters(methodDefinition, iocContainerInstance, scopedRepo, parent, args, name, assignedArguments, parentNamespace) {
    let parameters = null;
    if (methodDefinition) {
        parameters = [];
        for (let i = 0; i < methodDefinition.length; i++) {
            let parameterValue = undefined;
            if (typeof methodDefinition[i] === "string") {
                let namespace = methodDefinition[i];
                let fullNamespace = `${parentNamespace}/${namespace}`;
                namespace = iocContainerInstance.exists(fullNamespace) ? fullNamespace : namespace;
                parameterValue = iocContainerInstance.__get(namespace, parent);
            } else if (args.length > i) {
                parameterValue = args[i];
            } else if (methodDefinition[i] === parameterTypes.parent) {
                parameterValue = parent;
            } else if (methodDefinition[i] === parameterTypes.name) {
                parameterValue = name;
            } else if (methodDefinition[i] === parameterTypes.container) {
                parameterValue = iocContainerInstance._new(scopedRepo);
            }
            parameters.push(parameterValue);
        }
        if (assignedArguments)
            getParametersAssigned(assignedArguments, methodDefinition, parameters);
    } else {
        parameters = args;
    }
    return parameters;
}

module.exports = getMethodParameters;