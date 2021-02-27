const iocContainerModuleLoading = require("./helpers/iocContainerModuleLoading.js");
const iocContainerValidations = require("./helpers/iocContainerValidations");
const iocTypes = require("./types/ioc.js");

/**
 * The IOC container is an object containing the classes and the names they are bound to. 
 */
class iocContainer {
    constructor(factories) {
        /**
         * Object containing
         */
        this.iocEntities = {};
        this.scopedIOCEntities = {};
        this.factories = factories || [];
    }

    /**
  * The add method can be used to register a class definition. The object registered must have a constructor available since the framework will create a new instance when injected.
  * @param {string} nameSpace The name of the class or the namespace of the class.
  * @param {any} classDefinition The class definition to register in the IOC container
  * @param {boolean} detached When set to true and the class is injected to a property, no instance will be applied to the parent class. The property will be undefined after it is injected.
  */
    add(nameSpace, classDefinition, detached = false) {
        iocContainerValidations.validateIOCClassValues(nameSpace, classDefinition, this.iocEntities);
        this.iocEntities[nameSpace] = { classDefinition: classDefinition, type: iocTypes.instanced, detached };
    }

    /**
     * The addScoped method can be used to register a class definition in a scoped context. The object registered must have a constructor available since the framework will create a new instance when injected.
     * @param {string} nameSpace The name of the class or the namespace of the class.
     * @param {any} classDefinition The class definition to register in the IOC container
     */
    addScoped(nameSpace, classDefinition) {
        iocContainerValidations.validateIOCClassValues(nameSpace, classDefinition, this.iocEntities);
        this.iocEntities[nameSpace] = { classDefinition: classDefinition, type: iocTypes.scoped };
    }

    /**
     * The addScoped method can be used to register a class definition as a singleton. The object registered must have a constructor available since the framework will create a new instance when injected.
     * @param {string} nameSpace The name of the class or the namespace of the class.
     * @param {any} classDefinition The class definition to register in the IOC container
     */
    addSingleton(nameSpace, classDefinition) {
        iocContainerValidations.validateIOCClassValues(nameSpace, classDefinition, this.iocEntities);
        this.iocEntities[nameSpace] = { classDefinition: classDefinition, type: iocTypes.singleton };
    }

    /**
     * The addValue method can be used to register an object or value that will be injected without the constructor being called. When used with property injection, objects registered with addValue will require a name.
     * @param {string} nameSpace The name of the class or the namespace of the class.
     * @param {any} value The object to register into the IOC container
     */
    addValue(nameSpace, value) {
        iocContainerValidations.validateIOCValues(nameSpace, this.iocEntities);
        this.iocEntities[nameSpace] = { value: value, type: iocTypes.instanced, isValue: true };
    }

     /**
     * The addValue method can be used to register an object or value that will be injected without the constructor being called. This value will only be available in the same scope. When used with property injection, objects registered with addValue will require a name.
     * @param {string} nameSpace The name of the class or the namespace of the class.
     * @param {any} value The object to register into the IOC container
     */
    addValueScoped(nameSpace, value) {
        iocContainerValidations.validateIOCValues(nameSpace, this.iocEntities);
        this.scopedIOCEntities[nameSpace] = value;
    }

    /**
     * The addAnonymous method can be used to register a class definition for property injection. The object registered must have a constructor available since the framework will create a new instance when injected.
     * @param {string} nameSpace The name of the class or the namespace of the class.
     * @param {any} classDefinition The class definition to register in the IOC container
     * @param {boolean} detached When set to true and the class is injected to a property, no instance will be applied to the parent class. The property will be undefined after it is injected.
     */
    addAnonymous(nameSpace, classDefinition, detached = false) {
        iocContainerValidations.validateIOCClassValues(nameSpace, classDefinition, this.iocEntities);
        this.iocEntities[nameSpace] = { classDefinition: classDefinition, type: iocTypes.instanced, anonymous: true, detached };
    }

    /**
     * The addAnonymousValue method can be used to register an object or value that will be injected without the constructor being called. When used with property injection, objects registered with addAnonymousValue will not require a name.
     * @param {string} nameSpace The name of the class or the namespace of the class.
     * @param {any} value The object to register into the IOC container
     */
    addAnonymousValue(nameSpace, value) {
        iocContainerValidations.validateIOCValues(nameSpace, value, this.iocEntities);
        this.iocEntities[nameSpace] = { value: value, type: iocTypes.instanced, anonymous: true, isValue: true };
    }

    /**
     * The addToCollection method can be used to register a class definition in a collection for a namespace. The object registered must have a constructor available since the framework will create a new instance when injected.
     * @param {string} nameSpace 
     * @param {any} classDefinition 
     */
    addToCollection(nameSpace, classDefinition) {
        iocContainerValidations.validateIOCClassContainerValues(nameSpace, classDefinition, this.iocEntities);
        this.iocEntities[nameSpace].push({ classDefinition: classDefinition, type: iocTypes.instanced });
    }

    /**
    * The addScopedToCollection method can be used to register a class definition to a collection in a scoped context. The object registered must have a constructor available since the framework will create a new instance when injected.
    * @param {string} nameSpace The name of the class or the namespace of the class.
    * @param {any} classDefinition The class definition to register in the IOC container
    */
    addScopedToCollection(nameSpace, classDefinition) {
        iocContainerValidations.validateIOCClassContainerValues(nameSpace, classDefinition, this.iocEntities);
        this.iocEntities[nameSpace].push({ classDefinition: classDefinition, type: iocTypes.scoped });
    }

    /**
     * The addSingleton method can be used to register a class definition as a singleton to a collection. The object registered must have a constructor available since the framework will create a new instance when injected.
     * @param {string} nameSpace The name of the class or the namespace of the class.
     * @param {any} classDefinition The class definition to register in the IOC container
     */
    addSingletonToCollection(nameSpace, classDefinition) {
        iocContainerValidations.validateIOCClassContainerValues(nameSpace, classDefinition, this.iocEntities);
        this.iocEntities[nameSpace].push({ classDefinition: classDefinition, type: iocTypes.singleton });
    }

    /**
     * The addValueToCollection method can be used to register an object or value that will be injected without the constructor being called. When used with property injection, objects registered with addValue will require a name.
     * @param {string} nameSpace The name of the class or the namespace of the class.
     * @param {any} value The object to register into the IOC container
     */
    addValueToCollection(nameSpace, value) {
        iocContainerValidations.validateIOCCollectionValues(nameSpace, this.iocEntities);
        this.iocEntities[nameSpace].push({ value: value, type: iocTypes.instanced, isValue: true });
    }

    /**
     * Dependency injection ready classes can be retrieved via the get method. This is the method to be used after a class is registered in the IOC container. Please note that this not a class instance, the constructor on the result of the get method should be used to get an instance of the class.
     * @param {string} nameSpace The name of the class or the namespace of the class.
     */
    get(nameSpace, parameters) {
        if (!this.exists(nameSpace)) throw `Namespace ${nameSpace} is not registered.`;
        const newScope = {};
        return iocContainerModuleLoading.constructorInjectableFactory(this.iocEntities[nameSpace], this._new(newScope), nameSpace, newScope, undefined, undefined, parameters, false)
    }

    /**
     * Removes a registered namespace.
     * @param {string} namespace  The name of the class or the namespace of the class to remove.
     */
    delete(namespace){
        delete this.scopedIOCEntities[namespace];
        delete this.iocEntities[namespace];
    }

    /**
     * Replaces a namespace registration entry keeping the scope configuration. Can be class or value.
     * @param {string} namespace The name of the class or the namespace of the class to replace.
     * @param {any} value The value to replace the namespace with.
     */
    replace(namespace, value){
        if (this.scopedIOCEntities[namespace] && this.scopedIOCEntities[namespace].isValue) {
            this.scopedIOCEntities[namespace].value = value;
        }
        if (this.scopedIOCEntities[namespace] && !this.scopedIOCEntities[namespace].isValue) {
            this.scopedIOCEntities[namespace].classDefinition = value;
        }
        if (this.scopedIOCEntities[namespace]){
            this.scopedIOCEntities[namespace] = value;
        }
    }

    /**
     * Runs IOC container factories and checks if a class is registered in the IOC container.
     * @param {string} nameSpace The name of the class or the namespace of the class.
     */
    exists(nameSpace) {
        if (this.scopedIOCEntities[nameSpace]) return true;
        if (!this.iocEntities[nameSpace]) iocContainerModuleLoading.loadFactories(nameSpace, this);
        return !!this.iocEntities[nameSpace];
    }

    /**
     * Internal factory method
     * @private
     */
    _new(scopedRepo) {
        const result = new iocContainer();
        result.factories = this.factories;
        result.iocEntities = this.iocEntities;
        result.scopedIOCEntities = scopedRepo;
        return result;
    }

    /**
     * @private
     */
    __new(nameSpace, /*scopedRepo,*/ parent, name, assignedArguments) {
        if (!this.exists(nameSpace)) throw `Namespace ${nameSpace} is not registered.`;
        if (this.iocEntities[nameSpace].isValue) return this.iocEntities[nameSpace].value;
        return iocContainerModuleLoading.constructorInjectableFactory(this.iocEntities[nameSpace], this, nameSpace, this.scopedIOCEntities, parent, name, assignedArguments);
    }

    /**
     * @private
     */
    __get(nameSpace, /*scopedRepo,*/ parent, name, assignedArguments) {
        if (!this.exists(nameSpace)) throw `Namespace ${nameSpace} is not registered.`;
        return this.scopedIOCEntities[nameSpace] || this.__new(nameSpace, parent, name, assignedArguments);
    }
}

module.exports = { container: iocContainer, types: require("./types/parameterTypes.js") };