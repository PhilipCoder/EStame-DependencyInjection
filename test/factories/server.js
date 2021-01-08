const serverFactory = (nameSpace, containerInstance) => {
    containerInstance.add("basicClass", require("../classes/basicClass.js"));
    containerInstance.add("basicClass/model", require("../classes/modelAssignable.js"));
};

module.exports = serverFactory;