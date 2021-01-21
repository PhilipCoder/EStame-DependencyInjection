class controller {
    static get $constructor() { return ["action"]; }
    constructor(action) {
        this.action = action;
        this.name = "controller";
    }

    get $getAction() { return ["action"]; }
    getAction(action) {
        return action;
    }

}

module.exports = controller;