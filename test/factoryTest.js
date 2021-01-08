const assert = require('chai').assert;
const iocContainer = require("../iocContainer.js").container;
const basicClass = require("./classes/basicClass.js");
const iocAssignable = require("./classes/iocAssignable.js");
const modelAssignable = require("./classes/modelAssignable.js");

const serverFactory = (nameSpace, containerInstance) => {
    if (nameSpace.indexOf("/") === -1) {
        let packageName = `estame.${nameSpace}`;
        try {
            let packageFactoryFunction = require(packageName);
            packageFactoryFunction(nameSpace, containerInstance);
        } catch (e) {
        }
    }
};


describe('factory tests', function () {
    it("ioc container test", function () {
        require('module-alias/register')
        const container = new iocContainer([serverFactory]);

        const iocInstance = new (container.get("basicClass"))();
        const five = 5;
        iocInstance.$first.model = (value) => five * 2;
        let model = iocInstance.first;
        assert(model.functionAssigned() === 10, "Wrong result value");
    });
});