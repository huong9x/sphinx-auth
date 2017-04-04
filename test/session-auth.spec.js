const chai = require('chai');
chai.use(require('chai-as-promised'));
const assert = chai.assert;
const sinon = require('sinon');
const Credential = require('./../credential');
const SessionAuth = require('./../session-auth');

describe('Session Auth test suite', () => {
    let credentialProvider = {
        provide : () => {
        }
    };
    
    let sessionAuth = null;
    let sessionStorage = {
        source : {},
        set    : () => {
        },
        get : () => {
        }
    };
    
    before(async() => {
        sessionAuth = new SessionAuth(sessionStorage, credentialProvider).setCredentialKey('credential');
    });
    
    
    it('the credential should be stored in session when login success', async() => {
        sinon.stub(sessionStorage, 'set').callsFake((key, value) => {
            sessionStorage.source[key] = value;
        });
        sinon.stub(sessionStorage, 'get').callsFake((key) => {
            return sessionStorage.source[key];
        });
        sinon.stub(credentialProvider, 'provide').callsFake((username, password) => {
            return Promise.resolve(new Credential(username));
        });
        
        await sessionAuth.login('valid-username', 'valid-password');
        let credentialInSession = sessionStorage.get('credential');

        assert.instanceOf(credentialInSession, Credential);
        assert.equal(credentialInSession.getIdentity(), 'valid-username');
        
    })
});
