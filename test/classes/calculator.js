class calculator {
    constructor() {

    }

    get $getValue() { 
        var aa = this;
        return [undefined, undefined, "additionCalc"] }
    getValue(a, b, additionCalc) {
        var aa = this;

        return additionCalc.addValue(a, b);
    }
}

module.exports = calculator;