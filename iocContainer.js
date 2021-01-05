const constructProxyHandler = require("./constructProxyHandler.js");
const iocTypes = require("./types/ioc.js");

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
    for (let index = 0; index < containerInstance.factories.length; index++){
        let factories = containerInstance.factories[index](nameSpace);//should return { classDefinition, isAnonymous, namespace }
        if (factories && Array.isArray(factories)){
            factories.forEach(factory => {
                if (factory.isAnonymous){
                    containerInstance.addAnonymous(factory.namespace, factory.classDefinition);
                }else{
                    containerInstance.add(factory.namespace, factory.classDefinition);
                }
            });
        }
    }
};

class iocContainer {
    constructor() {
        this.iocEntities = {};
        this.factories = [];
    }

    addScoped(nameSpace, classDefinition) {
        validateIOCClassValues(nameSpace, classDefinition, this.iocEntities);
        this.iocEntities[nameSpace] = { classDefinition: classDefinition, type: iocTypes.scoped };
    }

    addSingleton(nameSpace, classDefinition) {
        validateIOCClassValues(nameSpace, classDefinition, this.iocEntities);
        this.iocEntities[nameSpace] = { classDefinition: classDefinition, type: iocTypes.singleton };
    }

    addValue(nameSpace, value) {
        validateIOCValues(nameSpace, this.iocEntities);
        this.iocEntities[nameSpace] = { value: value, type: iocTypes.instanced };
    }

    add(nameSpace, classDefinition, detached = false) {
        validateIOCClassValues(nameSpace, classDefinition, this.iocEntities);
        this.iocEntities[nameSpace] = { classDefinition: classDefinition, type: iocTypes.instanced, detached };
    }

    addAnonymous(nameSpace, classDefinition, detached = false) {
        validateIOCClassValues(nameSpace, classDefinition, this.iocEntities);
        this.iocEntities[nameSpace] = { classDefinition: classDefinition, type: iocTypes.instanced, anonymous: true, detached };
    }

    addAnonymousValue(nameSpace, value) {
        validateIOCValues(nameSpace, classDefinition, this.iocEntities);
        this.iocEntities[nameSpace] = { value: value, type: iocTypes.instanced, anonymous: true };
    }

    get(nameSpace) {
        if (!this.exists(nameSpace)) throw `Namespace ${nameSpace} is not registered.`;
        return new Proxy(this.iocEntities[nameSpace].classDefinition, new constructProxyHandler(this.iocEntities[nameSpace].type, nameSpace, {}, this));
    }

    exists(nameSpace){
        if (!this.iocEntities[nameSpace]) loadFactories(nameSpace, this);
        return !!this.iocEntities[nameSpace];
    }

    __new(nameSpace, scopedRepo, parent, name, assignedArguments) {
        if (!this.exists(nameSpace)) throw `Namespace ${nameSpace} is not registered.`;
        return new Proxy(this.iocEntities[nameSpace].classDefinition, new constructProxyHandler(this.iocEntities[nameSpace].type, nameSpace, Object.assign({},scopedRepo), this, parent, name, assignedArguments));
    }

    __get(nameSpace, scopedRepo, parent, name, assignedArguments) {
        if (!this.exists(nameSpace))  throw `Namespace ${nameSpace} is not registered.`;
        if (this.iocEntities[nameSpace].value) {
            return this.iocEntities[nameSpace].value;
        } else {
            return new (this.__new(nameSpace, scopedRepo, parent, name, assignedArguments))();
        }
    }
}

module.exports = iocContainer;