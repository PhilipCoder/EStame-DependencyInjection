const constructProxyHandler = require("./ProxyHandlers/constructProxyHandler.js");
const iocTypes = require("./types/ioc.js");
const parameterTypes = require("./types/parameterTypes.js");


const validateIOCClassValues = (nameSpace, classDefinition, iocContainer) => {
    if (typeof nameSpace !== "string") throw 'The namespace of an IOC entity has to be a string.';
    if (nameSpace.trim().length === 0) throw 'Please provide a namespace in order to register IOC entity.';
    if (typeof classDefinition !== "function") throw 'An IOC entity has to be a class or function.';
    if (iocContainer[nameSpace]) throw `Namespace ${nameSpace} is already registered.`;
};

const validateIOCValues = (nameSpace, iocContainer) => {
    if (typeof nameSpace !== "string") throw 'The namespace of an IOC entity has to be a string.';
    if (nameSpace.trim().length === 0) throw 'Please provide a namespace in order to register IOC entity.';
    if (iocContainer[nameSpace]) throw `Namespace ${nameSpace} is already registered.`;
};

const loadFactories = (nameSpace, containerInstance) => {
    for (let index = 0; index < containerInstance.factories.length; index++) {
        let factories = containerInstance.factories[index](nameSpace);//should return { classDefinition, isAnonymous, namespace }
        if (factories && Array.isArray(factories)) {
            factories.forEach(factory => {
                if (factory.isAnonymous) {
                    containerInstance.addAnonymous(factory.namespace, factory.classDefinition);
                } else {
                    containerInstance.add(factory.namespace, factory.classDefinition);
                }
            });
        }
    }
};

/**
 * The IOC container is an object containing the classes and the names they are bound to. 
 */
class iocContainer {
    constructor() {
        this.iocEntities = {};
        this.factories = [];
    }

    /**
     * The addScoped method can be used to register a class definition in a scoped context. The object registered must have a constructor available since the framework will create a new instance when injected.
     * @param {string} nameSpace The name of the class or the namespace of the class.
     * @param {any} classDefinition The class definition to register in the IOC container
     */
    addScoped(nameSpace, classDefinition) {
        validateIOCClassValues(nameSpace, classDefinition, this.iocEntities);
        this.iocEntities[nameSpace] = { classDefinition: classDefinition, type: iocTypes.scoped };
    }

    /**
     * The addScoped method can be used to register a class definition as a singleton. The object registered must have a constructor available since the framework will create a new instance when injected.
     * @param {string} nameSpace The name of the class or the namespace of the class.
     * @param {any} classDefinition The class definition to register in the IOC container
     */
    addSingleton(nameSpace, classDefinition) {
        validateIOCClassValues(nameSpace, classDefinition, this.iocEntities);
        this.iocEntities[nameSpace] = { classDefinition: classDefinition, type: iocTypes.singleton };
    }

    /**
     * The addValue method can be used to register an object or value that will be injected without the constructor being called. When used with property injection, objects registered with addValue will require a name.
     * @param {string} nameSpace The name of the class or the namespace of the class.
     * @param {any} value The object to register into the IOC container
     */
    addValue(nameSpace, value) {
        validateIOCValues(nameSpace, this.iocEntities);
        this.iocEntities[nameSpace] = { value: value, type: iocTypes.instanced, isValue: true };
    }

    /**
     * The add method can be used to register a class definition. The object registered must have a constructor available since the framework will create a new instance when injected.
     * @param {string} nameSpace The name of the class or the namespace of the class.
     * @param {any} classDefinition The class definition to register in the IOC container
     * @param {boolean} detached When set to true and the class is injected to a property, no instance will be applied to the parent class. The property will be undefined after it is injected.
     */
    add(nameSpace, classDefinition, detached = false) {
        validateIOCClassValues(nameSpace, classDefinition, this.iocEntities);
        this.iocEntities[nameSpace] = { classDefinition: classDefinition, type: iocTypes.instanced, detached };
    }

    /**
     * The addAnonymous method can be used to register a class definition for property injection. The object registered must have a constructor available since the framework will create a new instance when injected.
     * @param {string} nameSpace The name of the class or the namespace of the class.
     * @param {any} classDefinition The class definition to register in the IOC container
     * @param {boolean} detached When set to true and the class is injected to a property, no instance will be applied to the parent class. The property will be undefined after it is injected.
     */
    addAnonymous(nameSpace, classDefinition, detached = false) {
        validateIOCClassValues(nameSpace, classDefinition, this.iocEntities);
        this.iocEntities[nameSpace] = { classDefinition: classDefinition, type: iocTypes.instanced, anonymous: true, detached };
    }

    /**
     * The addAnonymousValue method can be used to register an object or value that will be injected without the constructor being called. When used with property injection, objects registered with addAnonymousValue will not require a name.
     * @param {string} nameSpace The name of the class or the namespace of the class.
     * @param {any} value The object to register into the IOC container
     */
    addAnonymousValue(nameSpace, value) {
        validateIOCValues(nameSpace, value, this.iocEntities);
        this.iocEntities[nameSpace] = { value: value, type: iocTypes.instanced, anonymous: true, isValue: true };
    }

    /**
     * Dependency injection ready classes can be retrieved via the get method. This is the method to be used after a class is registered in the IOC container. Please note that this not a class instance, the constructor on the result of the get method should be used to get an instance of the class.
     * @param {string} nameSpace The name of the class or the namespace of the class.
     */
    get(nameSpace) {
        if (!this.exists(nameSpace)) throw `Namespace ${nameSpace} is not registered.`;
        return new Proxy(this.iocEntities[nameSpace].classDefinition, new constructProxyHandler(this.iocEntities[nameSpace].type, nameSpace, {}, this, undefined, undefined, undefined, true));
    }

    /**
     * Runs IOC container factories and checks if a class is registered in the IOC container.
     * @param {string} nameSpace The name of the class or the namespace of the class.
     */
    exists(nameSpace) {
        if (!this.iocEntities[nameSpace]) loadFactories(nameSpace, this);
        return !!this.iocEntities[nameSpace];
    }

    /**
     * @private
     */
    __new(nameSpace, scopedRepo, parent, name, assignedArguments) {
        if (!this.exists(nameSpace)) throw `Namespace ${nameSpace} is not registered.`;
        return new Proxy(this.iocEntities[nameSpace].classDefinition, new constructProxyHandler(this.iocEntities[nameSpace].type, nameSpace, scopedRepo, this, parent, name, assignedArguments));
    }

    /**
     * @private
     */
    __get(nameSpace, scopedRepo, parent, name, assignedArguments) {
        if (!this.exists(nameSpace)) throw `Namespace ${nameSpace} is not registered.`;
        if (this.iocEntities[nameSpace].value) {
            return this.iocEntities[nameSpace].value;
        } else {
            return new (this.__new(nameSpace, scopedRepo, parent, name, assignedArguments))();
        }
    }
}

module.exports = { container: iocContainer, types: parameterTypes };