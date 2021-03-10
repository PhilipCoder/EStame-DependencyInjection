class server {
    static get $constructor() { return ["settings"]; }
    constructor(settings) {
        this.settings = settings;
    }

    get $runRequest() { return [undefined, "serverResponse"]; }
    get $$runRequest() { return ["authentication"] }
    runRequest(data, serverResponse) {
        return serverResponse.getResult(data);
    }
}

module.exports = server;