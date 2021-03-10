class serverResponse {
    getResult(result){
        return JSON.stringify(result);
    }
}

module.exports = serverResponse;