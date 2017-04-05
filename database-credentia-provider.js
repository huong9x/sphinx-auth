const VError = require('verror');
const Credential = require('./credential');

class DatabaseCredentialProvider {
    constructor(knex, hasher) {
        this.knex = knex;
        this.hasher = hasher;
    }
    
    setTable(tableName) {
        this.tableName = tableName;
        return this;
    }
    
    setIdentityField(identityField) {
        this.identityField = identityField;
        return this;
    }
    
    async provide(username, password) {
        let condition = {};
        condition[this.identityField] = username;
        let foundCredential = await this.knex.select().from(this.tableName).where(condition);
        
        if (!foundCredential.length) {
            throw new VError('E_AUTH: Username [%s] is not existed', username);
        }
        foundCredential = foundCredential[0];
        if (!await this.hasher.check(password, foundCredential.password)) {
            throw new VError('E_AUTH: Password mismatch');
        }
        
        return new Credential(foundCredential[this.identityField])
            .setData(foundCredential)
        ;
    }
}

module.exports = DatabaseCredentialProvider;
