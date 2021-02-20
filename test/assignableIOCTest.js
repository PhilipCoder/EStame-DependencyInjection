const assert = require('chai').assert;
const iocContainer = require("../iocContainer.js").container;
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

        const iocInstance = container.get("basicClass");
        const five = 5;
        iocInstance.$model = (value) => five * 2;
        let model = iocInstance.model;
        assert(model.functionAssigned() === 10, "Wrong result value");
    });

    it("named assignment", function () {
        const container = new iocContainer();
        container.add("basicClass", basicClass);
        container.add("basicClass/model", modelAssignable);

        const iocInstance = container.get("basicClass");
        const five = 5;
        iocInstance.$first.model = (value) => five * 2;
        let model = iocInstance.first;
        assert(model.functionAssigned() === 10, "Wrong result value");
    });

    it("anonymous assignment detached", function () {
        const container = new iocContainer();
        container.add("basicClass", basicClass);
        container.addAnonymous("basicClass/model", modelAssignable, true);

        const iocInstance = container.get("basicClass");
        const five = 5;
        iocInstance.$model = (value) => five * 2;
        let model = iocInstance.model;
        assert(model === undefined, "Wrong result value");
    });

    it("named assignment detached", function () {
        const container = new iocContainer();
        container.add("basicClass", basicClass);
        container.add("basicClass/model", modelAssignable, true);

        const iocInstance = container.get("basicClass");
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

        const iocInstance = container.get("basicClass");
        const five = 5;
        iocInstance.$model = (value) => five * 2;
        let model = iocInstance.model;
        assert(model.functionAssigned() === 10, "Wrong result value");

        iocInstance.model.$iocComplex.one.two = { value: 5 };
        iocInstance.model.iocComplex = [8,9];

        let complexIOC = iocInstance.model.iocComplex;

        assert(complexIOC.objectAssigned.value === 5, "Wrong result value");
        assert(complexIOC.stringAssignedA === "one", "Wrong result value");
        assert(complexIOC.stringAssignedB === "two", "Wrong result value");
        assert(complexIOC.arrayAssigned[0] === 8, "Wrong result value");
        assert(complexIOC.arrayAssigned[1] === 9, "Wrong result value");
        assert(complexIOC.name === null, "Wrong result value");
        assert(complexIOC.parent === iocInstance.model, "Wrong result value");
        assert(complexIOC.basicClass.addValue(2, 1) === 3, "Wrong result value");
    });

    it("anonymous assignment invalid namespace", function () {
        const container = new iocContainer();
        container.add("basicClass", basicClass);
        container.addAnonymous("basicClass/model", modelAssignable);
        container.addAnonymous("basicClass/iocComplex", iocAssignable);

        const iocInstance = container.get("basicClass");
        const five = 5;
        iocInstance.$model = (value) => five * 2;
        let model = iocInstance.model;
        assert(model.functionAssigned() === 10, "Wrong result value");

        assert.Throw(() => iocInstance.model.$iocComplex.one.two = { value: 5 }, "Namespace not found one.");;
    });
    it("anonymous assignment complex no namespace", function () {
        const container = new iocContainer();
        container.add("basicClass", basicClass);
        container.addAnonymous("basicClass/model", modelAssignable);
        container.addAnonymous("iocComplex", iocAssignable);

        const iocInstance = container.get("basicClass");
        const five = 5;
        iocInstance.$model = (value) => five * 2;
        let model = iocInstance.model;
        assert(model.functionAssigned() === 10, "Wrong result value");

        iocInstance.model.$iocComplex.one.two = { value: 5 };
        iocInstance.model.iocComplex = [8,9];

        let complexIOC = iocInstance.model.iocComplex;

        assert(complexIOC.objectAssigned.value === 5, "Wrong result value");
        assert(complexIOC.arrayAssigned[0] === 8, "Wrong result value");
        assert(complexIOC.arrayAssigned[1] === 9, "Wrong result value");
        assert(complexIOC.stringAssignedA === "one", "Wrong result value");
        assert(complexIOC.stringAssignedB === "two", "Wrong result value");
        assert(complexIOC.name === null, "Wrong result value");
        assert(complexIOC.parent === iocInstance.model, "Wrong result value");
        assert(complexIOC.basicClass.addValue(2, 1) === 3, "Wrong result value");
    });

    it("anonymous assignment complex line based", function () {
        const container = new iocContainer();
        container.add("basicClass", basicClass);
        container.addAnonymous("basicClass/model", modelAssignable);
        container.addAnonymous("basicClass/model/iocComplex", iocAssignable);

        const iocInstance = container.get("basicClass");
        const five = 5;
        iocInstance.$model = (value) => five * 2;
        let model = iocInstance.model;
        assert(model.functionAssigned() === 10, "Wrong result value");

        iocInstance.model.$iocComplex = "one";
        iocInstance.model.iocComplex = "two";
        iocInstance.model.iocComplex = { value: 5 };
        iocInstance.model.iocComplex = [8,9];

        let complexIOC = iocInstance.model.iocComplex;

        assert(complexIOC.objectAssigned.value === 5, "Wrong result value");
        assert(complexIOC.stringAssignedA === "one", "Wrong result value");
        assert(complexIOC.stringAssignedB === "two", "Wrong result value");
        assert(complexIOC.arrayAssigned[0] === 8, "Wrong result value");
        assert(complexIOC.arrayAssigned[1] === 9, "Wrong result value");
        assert(complexIOC.name === null, "Wrong result value");
        assert(complexIOC.parent === iocInstance.model, "Wrong result value");
        assert(complexIOC.basicClass.addValue(2, 1) === 3, "Wrong result value");
    });


    it("anonymous assignment complex array based", function () {
        const container = new iocContainer();
        container.add("basicClass", basicClass);
        container.addAnonymous("basicClass/model", modelAssignable);
        container.addAnonymous("basicClass/model/iocComplex", iocAssignable);

        const iocInstance = container.get("basicClass");
        const five = 5;
        iocInstance.$model = (value) => five * 2;
        let model = iocInstance.model;
        assert(model.functionAssigned() === 10, "Wrong result value");

        iocInstance.model.$iocComplex = _("one", "two", { value: 5 }, [8,9]);

        let complexIOC = iocInstance.model.iocComplex;

        assert(complexIOC.objectAssigned.value === 5, "Wrong result value");
        assert(complexIOC.stringAssignedA === "one", "Wrong result value");
        assert(complexIOC.stringAssignedB === "two", "Wrong result value");
        assert(complexIOC.arrayAssigned[0] === 8, "Wrong result value");
        assert(complexIOC.arrayAssigned[1] === 9, "Wrong result value");
        assert(complexIOC.name === null, "Wrong result value");
        assert(complexIOC.parent === iocInstance.model, "Wrong result value");
        assert(complexIOC.basicClass.addValue(2, 1) === 3, "Wrong result value");
    });
    it("named assignment complex", function () {
        const container = new iocContainer();
        container.add("basicClass", basicClass);
        container.addAnonymous("basicClass/model", modelAssignable);
        container.add("basicClass/model/iocComplex", iocAssignable);

        const iocInstance = container.get("basicClass");
        const five = 5;
        iocInstance.$model = (value) => five * 2;
        let model = iocInstance.model;
        assert(model.functionAssigned() === 10, "Wrong result value");

        iocInstance.model.$theName.iocComplex.one.two = { value: 5 };
        iocInstance.model.theName = [8,9];

        let complexIOC = iocInstance.model.theName;

        assert(complexIOC.arrayAssigned[0] === 8, "Wrong result value");
        assert(complexIOC.arrayAssigned[1] === 9, "Wrong result value");
        assert(complexIOC.objectAssigned.value === 5, "Wrong result value");
        assert(complexIOC.stringAssignedA === "one", "Wrong result value");
        assert(complexIOC.stringAssignedB === "two", "Wrong result value");
        assert(complexIOC.name === "theName", "Wrong result value");
        assert(complexIOC.parent === iocInstance.model, "Wrong result value");
        assert(complexIOC.basicClass.addValue(2, 1) === 3, "Wrong result value");
    });

    it("anonymous value assignment complex", function () {
        const container = new iocContainer();
        container.add("basicClass", basicClass);
        container.addAnonymousValue("basicClass/value", { value: 4 });

        const iocInstance = container.get("basicClass");
        iocInstance.$value
        let result = iocInstance.value;
        assert(result.value === 4, "Wrong result value");
    });

    it("named value assignment complex", function () {
        const container = new iocContainer();
        container.add("basicClass", basicClass);
        container.addValue("basicClass/value", { value: 4 });

        const iocInstance = container.get("basicClass");
        iocInstance.$myValue.value
        let result = iocInstance.myValue;
        assert(result.value === 4, "Wrong result value");
    });

    it("no parameters named", function () {
        const container = new iocContainer();
        container.add("basicClass", basicClass);
        container.add("basicClass/value", basicClass);

        const iocInstance = container.get("basicClass");
        iocInstance.$child.value
        let result = iocInstance.child;
        assert(result.addValue(3, 1) === 4, "Wrong result value");
    });

    it("no parameters anonymous", function () {
        const container = new iocContainer();
        container.add("basicClass", basicClass);
        container.addAnonymous("basicClass/value", basicClass);

        const iocInstance = container.get("basicClass");
        iocInstance.$value
        let result = iocInstance.value;
        assert(result.addValue(3, 1) === 4, "Wrong result value");
    });

    it("no parameters named detached", function () {
        const container = new iocContainer();
        container.add("basicClass", basicClass);
        container.add("basicClass/value", basicClass, true);

        const iocInstance = container.get("basicClass");
        let result = iocInstance.$one.value
        assert(result.addValue(3, 1) === 4, "Wrong result value");
        assert(iocInstance.one === undefined, "Detached should be undefined");
    });

    it("no parameters anonymous detached", function () {
        const container = new iocContainer();
        container.add("basicClass", basicClass);
        container.addAnonymous("basicClass/value", basicClass, true);

        const iocInstance = container.get("basicClass");
        let result = iocInstance.$value
        assert(result.addValue(3, 1) === 4, "Wrong result value");
        assert(iocInstance.value === undefined, "Detached should be undefined");
    });

    it("Injecting container", function () {
        const container = new iocContainer();
        container.add("basicClass", require("./classes/methodInjection.js"));

        const iocInstance = container.get("basicClass");
        let result = iocInstance.addValue(3, 1);
        assert(result.value === 4, "Wrong result value");
        assert(typeof result.container.add === "function", "Container not injected");
    });
});