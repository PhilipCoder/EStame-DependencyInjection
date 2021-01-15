const types = require("../../iocContainer.js").types;

class invoiceGenerator {
    static get $constructor() { return ["accountName", "invoiceLogic", types.container, types.string, types.number]; }
    constructor(account, logic, container, stringValue, numberValue) {
        this.logic = logic;
        this.account = account;
        this.container = container;
        this.stringValue = stringValue;
        this.numberValue = numberValue;
    }

    generateInvoice(totalValue, name) {
        return {
            invoiceDetail: this.logic.generate(name),
            totalValue: totalValue,
            account: this.account
        };
    }
}

module.exports = invoiceGenerator;