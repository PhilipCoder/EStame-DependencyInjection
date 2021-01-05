class calculator {
    constructor() {

    }

    get $getValue() { return [undefined, undefined, "additionCalc"] }
    getValue(a, b, additionCalc) {
        return additionCalc.addValue(a, b);
    }
}

module.exports = calculator;