class Credential {
    constructor(identity) {
        this.identity = identity;
    }
    
    setData(data) {
        this.data = data;
        return this;
    }
    
    getData() {
        return this.data;
    }
    
    getIdentity() {
        return this.identity;
    }
}

module.exports = Credential;
