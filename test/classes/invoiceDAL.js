class invoiceDAL{
    constructor(){

    }

    getValues(multiplicationFactor){
        return [2 * multiplicationFactor, 3 * multiplicationFactor, 4 * multiplicationFactor]
    }
}

module.exports = invoiceDAL;