class SessionAuth {
   constructor(credentialProvider) {
       this.credentialProvider = credentialProvider;
   }
   
   setSession(session) {
       this.session = session;
       return this;
   }
   
   setCredentialKey(credentialKey) {
       this.credentialKey = credentialKey;
       return this;
   }
   
   async login(username, password) {
       let foundCredential = await this.credentialProvider.provide(username, password);
       this.session.set(this.credentialKey, foundCredential);
   }
   
   logout() {
       this.session.unset(this.credentialKey);
   }
 
   guest() {
       return ! this.check();
   }
   
   check() {
       return this.session.has(this.credentialKey);
   }
}

module.exports = SessionAuth;
