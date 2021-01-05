class invoiceGenerator{
    static get $constructor(){ return ["accountName", "invoiceLogic"]; }
    constructor(account, logic){
        this.logic = logic;
        this.account = account;
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