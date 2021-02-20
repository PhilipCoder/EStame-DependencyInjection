class parent {
    static get $constructor(){return ["someValue","children"];}
    constructor(values, children) {
        this.values = values;
        this.children = children;
        this.descriptor = "parent";
    }

    addValue(a, b) {
        return a + b;
    }
}

module.exports = parent;