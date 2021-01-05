class invoiceLogic{
    static get $constructor(){ return ["invoiceDAL"]; }
    constructor(dal){
        this.dal = dal;
    }

    generate(name){
        return {
            name, 
            values : this.dal.getValues(3)
        };
    }
}

module.exports = invoiceLogic;