const types = require("../../iocContainer.js").types;

class invoiceGenerator{
    static get $constructor(){ return ["accountName", "invoiceLogic", types.container]; }
    constructor(account, logic, container){
        this.logic = logic;
        this.account = account;
        this.container = container;
    }

    generateInvoice(totalValue, name){
        return {
            invoiceDetail : this.logic.generate(name),
            totalValue: totalValue,
            account: this.account
        };
    }
}

module.exports = invoiceGenerator;