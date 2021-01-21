class server{
    static get $constructor(){ return ["controller"]; }
    constructor(controller){
        this.controller = controller;
        this.name = "server";
    }

    
}

module.exports = server;