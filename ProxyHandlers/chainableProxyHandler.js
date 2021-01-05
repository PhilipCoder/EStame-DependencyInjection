const parameterTypes = require("../types/parameterTypes.js");

class chainableProxyHandler {
    constructor(nameSpace, parent, property, iocContainer, scopedRepo) {
        this.instanceIndicator = Symbol("chainProxy");
        this.requiresName = null;
        this.name = null;
        this.nameSpace = nameSpace;
        this.constructorDefinition = null;
        this.property = property;
        this.iocContainer = iocContainer;
        this.scopedRepo = scopedRepo;
        this.assignedParameters = [];
        this.parent = parent;
        this.assignedParameterCountPopulated = false;
        this.parameterTypeCount = {
            string: 0,
            number: 0,
            object: 0,
            function: 0,
            boolean: 0
        };
        this.assignedParameterTypeCount = {
            string: 0,
            number: 0,
            object: 0,
            function: 0,
            boolean: 0
        };
        //anonymous assignable
        let anonymousNamespace = `${nameSpace}/${property}`;
        this.requiresName = !iocContainer.exists(anonymousNamespace);
        if (this.requiresName) {
            this.name = this.property;
        }
        else {
            let iocDefinition = iocContainer.iocEntities[anonymousNamespace];
            if (!iocDefinition.anonymous) throw `Namespace ${anonymousNamespace} requires a name.`;
            this.nameSpace = anonymousNamespace;
            this.constructorDefinition = iocDefinition.classDefinition.$constructor;
            this.populateAssignedParameterCount();
        }
    }

    completeAssignment() {
        let resultConstructor = this.iocContainer.__new(this.nameSpace, this.scopedRepo, this.parent, this.name, this.assignedParameters);
        this.parent[this.name || this.property] = new resultConstructor();
        if (this.iocContainer.iocEntities[this.nameSpace].detached) {
            delete this.parent[this.name || this.property];
        }
    }

    get(target, property, proxy) {
        if (property === "_$instanceIndicator") return this.instanceIndicator;
        if (this.requiresName && !this.constructorDefinition) {
            this.initNamedAssignable(property);
        } else {
            this.assignedParameters.push(property);
            this.updateAssignedValueCount(property);
        }
        if (this.isCompleted) {
            this.completeAssignment();
            return this.parentTarget[this.parentProperty];
        } else {
            return proxy;
        }
    }

    initNamedAssignable(property) {
      //  this.name = property;
        this.nameSpace = `${this.nameSpace}/${property}`;
        if (!this.iocContainer.exists(this.nameSpace))
            throw `Namespace not found ${this.nameSpace}.`;
        let iocDefinition = this.iocContainer.iocEntities[this.nameSpace];
        if (iocDefinition.anonymous)
            throw `Namespace ${this.nameSpace} is defined as anonymous but is used in a named context.`;
        this.constructorDefinition = iocDefinition.classDefinition.$constructor;
        this.populateAssignedParameterCount();
    }

    set(target, property, value, proxy) {
        if (this.requiresName && !this.constructorDefinition) {
            this.initNamedAssignable(property);
        } else if (property !== "__$someValue"){
             this.assignedParameters.push(property);
             this.updateAssignedValueCount(property);
         }
        this.assignedParameters.push(value);
        this.updateAssignedValueCount(value);
        if (this.isCompleted) {
            this.completeAssignment();
        }
        return true;
    }

    static new(nameSpace, parent, property, iocContainer, scopedRepo) {
        return new Proxy({}, new chainableProxyHandler(nameSpace, parent, property, iocContainer, scopedRepo));
    }

    validateAssignment() {
        for (let key in this.assignedParameterTypeCount) {
            if (this.parameterTypeCount[key] < this.parameterTypeCount[key]) throw `Invalid assigned values ${this.nameSpace}.`;
        }
    }

    updateAssignedValueCount(value){
        let valueType = typeof value;
        if (this.assignedParameterTypeCount[valueType] !== undefined){
            this.assignedParameterTypeCount[valueType]++;
        }
    }

    populateAssignedParameterCount() {
        if (this.constructorDefinition) {
            this.assignedParameterCountPopulated = true;
            this.constructorDefinition.forEach(definition => {
                if (parameterTypes.string === definition) {
                    this.parameterTypeCount.string++;
                } else if (parameterTypes.number === definition) {
                    this.parameterTypeCount.number++;
                } else if (parameterTypes.object === definition) {
                    this.parameterTypeCount.object++;
                } else if (parameterTypes.function === definition) {
                    this.parameterTypeCount.function++;
                } else if (parameterTypes.boolean === definition) {
                    this.parameterTypeCount.boolean++;
                }
            });
        }
    }

    get isCompleted() {
        this.validateAssignment();
        return this.constructorDefinition && this.assignedParameterTypeCount.string >= this.parameterTypeCount.string &&
            this.assignedParameterTypeCount.number >= this.parameterTypeCount.number &&
            this.assignedParameterTypeCount.object >= this.parameterTypeCount.object &&
            this.assignedParameterTypeCount.function >= this.parameterTypeCount.function &&
            this.assignedParameterTypeCount.boolean >= this.parameterTypeCount.boolean;
    }


}

module.exports = chainableProxyHandler;