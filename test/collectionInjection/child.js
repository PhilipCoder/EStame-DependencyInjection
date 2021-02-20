class child {
    static get $constructor() { return ["someValues"]; }
    constructor(someValues) {
        this.descriptor = "child";
        this.someValues = someValues;
    }

    $getSomeStuff() { return ["someValues", "someValue"]; }
    getSomeStuff(someValues, someValue) {
        return { someValues, someValue };
    }

}

module.exports = child;