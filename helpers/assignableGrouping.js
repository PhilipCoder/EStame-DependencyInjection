class assignableGrouping {
    constructor(values) {
        this.values = values;
    }
}

const _ = function () {
    return new assignableGrouping(Array.from(arguments));
}

try{
    window._ = _;
}catch(e){
    global._ = _;
}


module.exports = { _, assignableGrouping };