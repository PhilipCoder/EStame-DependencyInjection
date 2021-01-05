const assert = require('chai').assert;
const iocContainer = require("../iocContainer.js");
const basicClass = require("./classes/basicClass.js");
const iocAssignable = require("./classes/iocAssignable.js");
const modelAssignable = require("./classes/modelAssignable.js");

describe('assignable IOC', function () {
    it("basic constructor", function () {
        const container = new iocContainer();
        container.add("basicClass", basicClass);
        container.add("iocAssignable", iocAssignable);

        let parent = Symbol("parent");
        const iocInstance = container.__get("iocAssignable", {}, parent, "someIOC", [{ value: 2 }, "valueA", "valueB"]);
        assert(iocInstance.name === "someIOC", "Wrong name");
        assert(iocInstance.objectAssigned.value === 2, "Wrong object");
        assert(iocInstance.parent === parent, "Wrong parent");
        assert(iocInstance.stringAssignedA === "valueA", "Wrong string value");
        assert(iocInstance.stringAssignedB === "valueB", "Wrong string value");
    });

    it("anonymous assignment", function () {
        const container = new iocContainer();
        container.add("basicClass", basicClass);
        container.addAnonymous("basicClass/model", modelAssignable);

        const iocInstance = new (container.get("basicClass"))();
        const five = 5;
        iocInstance.$model = (value) => five * 2;
        let model = iocInstance.model;
        assert(model.functionAssigned() === 10, "Wrong result value");
    });

    it("named assignment", function () {
        const container = new iocContainer();
        container.add("basicClass", basicClass);
        container.add("basicClass/model", modelAssignable);

        const iocInstance = new (container.get("basicClass"))();
        const five = 5;
        iocInstance.$first.model = (value) => five * 2;
        let model = iocInstance.first;
        assert(model.functionAssigned() === 10, "Wrong result value");
    });

    it("anonymous assignment detached", function () {
        const container = new iocContainer();
        container.add("basicClass", basicClass);
        container.addAnonymous("basicClass/model", modelAssignable, true);

        const iocInstance = new (container.get("basicClass"))();
        const five = 5;
        iocInstance.$model = (value) => five * 2;
        let model = iocInstance.model;
        assert(model === undefined, "Wrong result value");
    });

    it("named assignment detached", function () {
        const container = new iocContainer();
        container.add("basicClass", basicClass);
        container.add("basicClass/model", modelAssignable, true);

        const iocInstance = new (container.get("basicClass"))();
        const five = 5;
        iocInstance.$first.model = (value) => five * 2;
        let model = iocInstance.first;
        assert(model === undefined, "Wrong result value");
    });

    it("anonymous assignment complex", function () {
        const container = new iocContainer();
        container.add("basicClass", basicClass);
        container.addAnonymous("basicClass/model", modelAssignable);
        container.addAnonymous("basicClass/model/iocComplex", iocAssignable);

        const iocInstance = new (container.get("basicClass"))();
        const five = 5;
        iocInstance.$model = (value) => five * 2;
        let model = iocInstance.model;
        assert(model.functionAssigned() === 10, "Wrong result value");

        iocInstance.model.$iocComplex.one.two = { value: 5 };

        let complexIOC = iocInstance.model.iocComplex;
        
        assert(complexIOC.objectAssigned.value === 5, "Wrong result value");
        assert(complexIOC.stringAssignedA === "one", "Wrong result value");
        assert(complexIOC.stringAssignedB === "two", "Wrong result value");
        assert(complexIOC.name === null, "Wrong result value");
        assert(complexIOC.parent === iocInstance.model, "Wrong result value");
        assert(complexIOC.basicClass.addValue(2,1) === 3, "Wrong result value");
    });

    it("named assignment complex", function () {
        const container = new iocContainer();
        container.add("basicClass", basicClass);
        container.addAnonymous("basicClass/model", modelAssignable);
        container.add("basicClass/model/iocComplex", iocAssignable);

        const iocInstance = new (container.get("basicClass"))();
        const five = 5;
        iocInstance.$model = (value) => five * 2;
        let model = iocInstance.model;
        assert(model.functionAssigned() === 10, "Wrong result value");

        iocInstance.model.$theName.iocComplex.one.two = { value: 5 };

        let complexIOC = iocInstance.model.theName;
        
        assert(complexIOC.objectAssigned.value === 5, "Wrong result value");
        assert(complexIOC.stringAssignedA === "one", "Wrong result value");
        assert(complexIOC.stringAssignedB === "two", "Wrong result value");
        assert(complexIOC.name === "theName", "Wrong result value");
        assert(complexIOC.parent === iocInstance.model, "Wrong result value");
        assert(complexIOC.basicClass.addValue(2,1) === 3, "Wrong result value");
    });
});