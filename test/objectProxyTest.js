const assert = require('chai').assert;
const iocContainer = require("../iocContainer.js").container;
const basicClass = require("./classes/basicClass.js");
const calculator = require("./classes/calculator.js");
const additionCalc = require("./classes/additionCalc.js");
const invoiceGenerator = require("./classes/invoiceGenerator.js");
const invoiceLogic = require("./classes/invoiceLogic.js");
const invoiceDAL = require("./classes/invoiceDAL.js");
const parent = require("./collectionInjection/parent.js");
const child = require("./collectionInjection/child.js");

describe('objectProxy', function () {
    it("basic constructor", function () {
        const container = new iocContainer();
        container.add("basicClass", basicClass);

        let basicClassInstance = container.get("basicClass");
        let addition = basicClassInstance.addValue(5, 4);
        assert(addition === 9, "Incorrect value returned.");
    });

    it("method injection", function () {
        const container = new iocContainer();
        container.add("calculator", calculator);
        container.add("additionCalc", additionCalc);

        let calculatorInstance = container.get("calculator");
        let addition = calculatorInstance.getValue(5, 4);
        let additionB = calculatorInstance.getValue(8, 4);

        assert(addition === 9, "Incorrect value returned.");
        assert(additionB === 12, "Incorrect value returned.");

    });

    it("constructor injection", function () {
        const container = new iocContainer();
        container.add("invoiceGenerator", invoiceGenerator);
        container.add("invoiceLogic", invoiceLogic);
        container.add("invoiceDAL", invoiceDAL);
        container.addValue("accountName", "Doe");

        let generatorInstance = container.get("invoiceGenerator", ["Jan", 20]);
        let invoice = generatorInstance.generateInvoice(500, "The Name");
        let invoiceB = generatorInstance.generateInvoice(5000, "The NameB");
        assert(generatorInstance.stringValue === "Jan", "Parameter value not assigned");
        assert(generatorInstance.numberValue === 20, "Parameter value not assigned");
        assert(invoice.account === "Doe", "Incorrect value returned.");
        assert(generatorInstance.container instanceof iocContainer, "Incorrect value returned.");
        assert(invoice.totalValue === 500, "Incorrect value returned.");
        assert(invoiceB.totalValue === 5000, "Incorrect value returned.");
        assert(invoice.invoiceDetail.name === "The Name", "Incorrect value returned.");
        assert(invoiceB.invoiceDetail.name === "The NameB", "Incorrect value returned.");
        assert(invoice.invoiceDetail.values[0] === 6, "Incorrect value returned.");
        assert(invoice.invoiceDetail.values[1] === 9, "Incorrect value returned.");
        assert(invoice.invoiceDetail.values[2] === 12, "Incorrect value returned.");
    });

    it("constructor injection inherited namespaces", function () {
        const container = new iocContainer();
        container.add("server", require("./classesInheritedNamespace/server.js"));
        container.add("server/controller", require("./classesInheritedNamespace/controller.js"));
        container.add("server/controller/action", require("./classesInheritedNamespace/action.js"));

        let serverInstance = container.get("server");
        let action = serverInstance.controller.getAction();
        assert(serverInstance.name === "server", "Server wrongly assigned");
        assert(serverInstance.controller.name === "controller", "Controller wrongly assigned");
        assert(serverInstance.controller.action.name === "action", "Action wrongly assigned");
        assert(action.name === "action", "Action wrongly assigned");

    });

    it("collection injection", function () {
        const container = new iocContainer();
        container.add("parent", parent);
        container.addToCollection("children", child);
        container.addValueToCollection("children", { name: "childA" });
        container.addValue("someValue", { name: "This is a value" });

        container.addValueToCollection("someValues", { name: "ValueA" });
        container.addValueToCollection("someValues", { name: "ValueB" });

        let parentInstance = container.get("parent");
        assert(parentInstance.children.length === 2, "Children not injected");
        assert(parentInstance.children[0].descriptor === "child", "Wrong value injected");
        assert(parentInstance.children[1].name === "childA", "Wrong value injected");
        assert(parentInstance.children[0].someValues.length === 2, "Wrong value injected");
        assert(parentInstance.children[0].someValues[0].name === "ValueA", "Wrong value injected");
        assert(parentInstance.children[0].someValues[1].name === "ValueB", "Wrong value injected");

    });

    it("method interception", function () {
        const container = new iocContainer();
        container.add("server", require("./methodInterception/server.js"));
        container.add("serverResponse", require("./methodInterception/serverResponse.js"));
        container.add("authentication", require("./methodInterception/authenticationInterceptor.js"));
        container.addValue("settings", { name: "JohnDoe" });

        let serverInstance = container.get("server");
        assert(serverInstance.settings.name === "JohnDoe", "Settings not injected correctly");
        let methodResultIntercepted = serverInstance.runRequest({ id: 1 });
        assert(methodResultIntercepted === "Hello one", "Method not intercepted correctly");
        let methodResult =  serverInstance.runRequest({ name: "Toyota" });
        assert(methodResult === JSON.stringify({ name: "Toyota" }), "Method not intercepted correctly");
    });

});