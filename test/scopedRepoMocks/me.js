class me {
    static get $constructor() { return ["scopedGene"]; }
       constructor(scopedGene) {
           this.instance = Symbol("Instance");
           this.scopedGene = scopedGene;
       }
   }
   
   module.exports = me;