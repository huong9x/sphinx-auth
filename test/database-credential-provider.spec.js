const path = require('path');
const chai = require('chai');
chai.use(require('chai-as-promised'));
const assert = chai.assert;
const sinon = require('sinon');
const Credential = require('./../credential');
const DatabaseCredentialProvider = require('./../database-credentia-provider.js');
const knex = require('knex')({
    client     : 'sqlite3',
    connection : {
        filename : path.normalize(path.join(__dirname, '.db', 'db.sqlite'))
    }
    
});

describe('CredentialProvider tests', () => {
    let databaseCredentialProvider = null;
    let hasher = {
        check : () => {
        }
    };
    
    before(async() => {
        await knex.schema.createTableIfNotExists('tbl_credentials', function (table) {
            table.increments();
            table.string('username');
            table.string('password')
        });
        
        databaseCredentialProvider = new DatabaseCredentialProvider(knex, hasher).setTable('tbl_credentials').setIdentityField('username');
    });
    
    beforeEach(async() => {
        await knex.table('tbl_credentials').truncate();
        await knex.from('tbl_credentials').insert([
            {
                username : 'valid-username1',
                password : 'valid-password1'
            },
            {
                username : 'valid-username2',
                password : 'valid-password2'
            }
        ])
    });
    
    afterEach(async() => {
        await knex.table('tbl_credentials').truncate();
        hasher.check.restore();
    });
    
    it('should provides credential', async() => {
        sinon.stub(hasher, 'check').withArgs('valid-password1', 'valid-password1').returns(Promise.resolve(true));
        
        let result = await databaseCredentialProvider.provide('valid-username1', 'valid-password1');
        
        assert(result);
        assert.instanceOf(result, Credential);
        assert.equal(result.getIdentity(), 'valid-username1');
    });
    
    it('should throw error when identity is not found', async() => {
        sinon.stub(hasher, 'check').returns(true);
        
        let result = databaseCredentialProvider.provide('nonExisted', 'valid-password1');
        
        return assert.isRejected(result, 'E_AUTH: Username [nonExisted] is not existed');
    });
    
    it('should throw error when password is mismatched', async() => {
        sinon.stub(hasher, 'check').returns(false);
        
        let result = databaseCredentialProvider.provide('valid-username1', 'valid-password1');
        
        return assert.isRejected(result, 'E_AUTH: Password mismatch');
    });
    
    
});
