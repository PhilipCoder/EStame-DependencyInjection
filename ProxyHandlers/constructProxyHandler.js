const singletonRepo = require("../state/singletonRepo.js");
const iocTypes = require("../types/ioc.js");
const classProxyHandler = require("./classProxyHandler.js");

const getMethodParameters = require("../helpers/methodParameters.js");


class constructProxyHandler {
    constructor(iocType, namespace, scopedRepo, iocContainerInstance, parent, name, assignedArguments, forceNew) {
        this.construct = (target, args, newTarget) => {
            scopedRepo = forceNew ? {} : scopedRepo;
            let parameters = getMethodParameters(target.$constructor, iocContainerInstance, scopedRepo, parent, args, name, assignedArguments);
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
