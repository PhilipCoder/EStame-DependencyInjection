const methodHandler = require("./methodHandler.js");
const chainableProxyHandler = require("./chainableProxyHandler.js");

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
            target[property] = chainableProxyHandler.new(this.namespace, proxy, propertyName, this.iocContainerInstance,  this.scopedRepo); //$element.$model = () => model.one; $element.$color.style = () => model.two
            target[property].__$someValue = value;
        } else {
            target[property] = value;
        }
        return true;
    }

    get(target, property, proxy) {
        if (property === "__scopedRepo") {
            return this.scopedRepo;
        } else if (property === "__namespace") {
            return this.namespace;
        }
        else if (typeof target[property] === "function" && Array.isArray(target[`$${property}`])) {
            this.methodProxies[property] = this.methodProxies[property] || new Proxy(target[property], new methodHandler(target[`$${property}`], Object.assign({},this.scopedRepo), this.iocContainerInstance));
            return this.methodProxies[property];
        } else if (target[property] === undefined && property.startsWith("$")) {
            let propertyName = property.substring(1);
            target[property] = chainableProxyHandler.new(this.namespace, proxy, propertyName, this.iocContainerInstance, this.scopedRepo);
        }
        return target[property];
    }
}

module.exports = classProxyHandler;