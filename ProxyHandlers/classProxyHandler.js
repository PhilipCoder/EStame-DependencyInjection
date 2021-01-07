const methodHandler = require("./methodProxyHandler.js");
const chainableProxyHandler = require("./chainableProxyHandler.js");
const chainableProxy = require("./chainableProxy.js");

class classProxyHandler {
    constructor(scopedRepo, iocContainerInstance, namespace, parent) {
        this.constructorProxy = null;
        this.methodProxies = {};
        this.scopedRepo = scopedRepo;
        this.namespace = namespace;
        this.iocContainerInstance = iocContainerInstance;
        this.parent = parent;
    }

    set(target, property, value, proxy) { //only anonymous
        if (target[property] === undefined && property.startsWith("$")) {
            let propertyName = property.substring(1);
            target[propertyName] = chainableProxyHandler.new(this.namespace, proxy, propertyName, this.iocContainerInstance,  this.scopedRepo); //$element.$model = () => model.one; $element.$color.style = () => model.two
            target[propertyName].__$someValue = value;
        } else if (target[property] instanceof chainableProxy && property.startsWith("$")){
            let propertyName = property.substring(1);
            target[propertyName].__$someValue = value;
        }else if (target[property] instanceof chainableProxy){
            target[property].__$someValue = value;
        }else {
            target[property] = value;
        }
        return true;
    }

    get(target, property, proxy) {
        let propertyName = property.startsWith("$") ? property.substring(1) : property;
        if (property === "__scopedRepo") {
            return this.scopedRepo;
        } else if (property === "__namespace") {
            return this.namespace;
        } else if (property ==="_target"){
            return target;
        }
        else if (typeof target[property] === "function" && Array.isArray(target[`$${property}`])) {
            this.methodProxies[property] = this.methodProxies[property] || new Proxy(target[property], new methodHandler(target[`$${property}`], Object.assign({},this.scopedRepo), this.iocContainerInstance));
            return this.methodProxies[property];
        } else if (target[property] === undefined && property.startsWith("$")) {
            target[propertyName] = chainableProxyHandler.new(this.namespace, proxy, propertyName, this.iocContainerInstance, this.scopedRepo);
            if (target[propertyName]._$value) {
                target[propertyName] = target[propertyName]._$value;
            } 
        }
        return target[propertyName];
    }
}

module.exports = classProxyHandler;