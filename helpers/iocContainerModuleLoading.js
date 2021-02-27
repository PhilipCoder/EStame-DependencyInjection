const constructProxyHandler = require("../ProxyHandlers/constructProxyHandler.js");
const _ = require("../helpers/methodParameters.js");

const loadFactories = (nameSpace, containerInstance) => {
    for (let index = 0; index < containerInstance.factories.length; index++) {
        containerInstance.factories[index](nameSpace, containerInstance);
    }
};

const constructorProxyFactory = (registeredEntry, iocContainer, nameSpace, scopedRepo, parent, name, assignedArguments, forceNew) => {
    if (registeredEntry.value) return registeredEntry.value;
    const result = new (new Proxy(registeredEntry.classDefinition, new constructProxyHandler(registeredEntry.type, nameSpace, scopedRepo, iocContainer, parent, name, assignedArguments, !!forceNew)))();
    result.___handleConstructEvent(result);
    return result;
}


const constructorInjectableFactory = (registeredEntry, iocContainer, nameSpace, scopedRepo, parent, name, assignedArguments, forceNew) => Array.isArray(registeredEntry) ?
    registeredEntry.map((entry) => constructorProxyFactory(entry, iocContainer, nameSpace, scopedRepo, parent, name, assignedArguments, forceNew)) :
    constructorProxyFactory(registeredEntry, iocContainer, nameSpace, scopedRepo, parent, name, assignedArguments, forceNew)


module.exports = { loadFactories, constructorProxyFactory, constructorInjectableFactory };