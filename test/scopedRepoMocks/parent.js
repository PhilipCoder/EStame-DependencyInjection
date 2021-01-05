class parent {
    static get $constructor() { return ["scopedGene", "me"]; }
    constructor(scopedGene, me) {
        this.instance = Symbol("Instance");
        this.me = me;
        this.scopedGene = scopedGene;
    }
}

module.exports = parent;