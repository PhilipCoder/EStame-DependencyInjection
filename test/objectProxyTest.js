const assert = require('chai').assert;
const iocContainer = require("../iocContainer.js").container;
const basicClass = require("./classes/basicClass.js");
const calculator = require("./classes/calculator.js");
const additionCalc = require("./classes/additionCalc.js");
const invoiceGenerator = require("./classes/invoiceGenerator.js");
const invoiceLogic = require("./classes/invoiceLogic.js");
const invoiceDAL = require("./classes/invoiceDAL.js");


describe('objectProxy', function () {
    it("basicConstructor",function () {
        const container = new iocContainer();
        container.add("basicClass", basicClass);

        let basicClassDefinition = container.get("basicClass");
        let basicClassInstance = new basicClassDefinition();
        let addition = basicClassInstance.addValue(5, 4);
        assert(addition === 9, "Incorrect value returned.");
    });

    it("methodInjection", function () {
        const container = new iocContainer();
        container.add("calculator", calculator);
        container.add("additionCalc", additionCalc);


        let calculatorClassDefinition = container.get("calculator");
        let calculatorInstance = new calculatorClassDefinition();
        let addition = calculatorInstance.getValue(5, 4);
        let additionB = calculatorInstance.getValue(8, 4);

        assert(addition === 9, "Incorrect value returned.");
        assert(additionB === 12, "Incorrect value returned.");

    });

    it("constructorInjection", function () {
        const container = new iocContainer();
        container.add("invoiceGenerator", invoiceGenerator);
        container.add("invoiceLogic", invoiceLogic);
        container.add("invoiceDAL", invoiceDAL);
        container.addValue("accountName", "Doe");

        let invoiceGeneratorClassDefinition = container.get("invoiceGenerator",["Jan",20]);
        let generatorInstance = new invoiceGeneratorClassDefinition();
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

});