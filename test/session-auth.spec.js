const chai = require('chai');

chai.use(require('chai-as-promised'));

const assert = chai.assert;

const sinon       = require('sinon');
const Credential  = require('./../credential');
const SessionAuth = require('./../session-auth');

describe('Session Auth test suite', () => {
    let credentialProvider = null;
    let sessionAuth = null;
    let sessionStorage = null;
    
    beforeEach(async() => {
        credentialProvider = {
            provide : () => {
            }
        };
        sessionStorage = {
            set   : () => {
            },
            unset : () => {
            },
            has   : () => {
                
            }
        };
        sessionAuth = new SessionAuth(credentialProvider).setCredentialKey('credential').setSession(sessionStorage);
    });
    
    
    it('the credential should be stored in session when login success', async() => {
        
        let returnedCredential = new Credential('valid-username');
        let providerSpy = sinon.stub(credentialProvider, 'provide')
            .withArgs('valid-username', 'valid-password')
            .returns(Promise.resolve(returnedCredential));
        
        let sessionSpy = sinon.stub(sessionStorage, 'set');
        
        await sessionAuth.login('valid-username', 'valid-password');
        
        assert(sessionSpy.calledOnce);
        assert(sessionSpy.calledWith('credential', returnedCredential));
        assert(providerSpy.calledOnce);
        
    });
    
    it('the credential should be clean in session when logout', async() => {
        let sessionSpy = sinon.stub(sessionStorage, 'unset');
        
        sessionAuth.logout();
        
        assert(sessionSpy.calledOnce);
        assert(sessionSpy.calledWith('credential'));
    });
    
    it('can check login status when is guest', async() => {
        sinon.stub(sessionStorage, 'has').returns(false);
        
        assert(sessionAuth.guest());
        assert.notOk(sessionAuth.check());
    });
    
    it('can check login status is logged in', async() => {
        sinon.stub(sessionStorage, 'has').returns(true);
        
        assert.notOk(sessionAuth.guest());
        assert.ok(sessionAuth.check());
    });
});
