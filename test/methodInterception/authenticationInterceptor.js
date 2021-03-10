class authenticationInterceptor{
    static get $constructor(){return ["settings"];}
    constructor(settings){
        this.settings = settings;
    }

    intercept(data){
        if (data.id === 1) return "Hello one";
        return false;
    }
}

module.exports = authenticationInterceptor;