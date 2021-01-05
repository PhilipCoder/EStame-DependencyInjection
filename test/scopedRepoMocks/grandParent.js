class grandParent {
    static get $constructor() { return ["parent", "parent"]; }
    constructor(parentA, parentB) {
        this.parentA = parentA;
        this.parentB = parentB;
        this.instance = Symbol("Instance");
    }
}

module.exports = grandParent;