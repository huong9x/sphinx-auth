class SessionAuth {
   constructor(sessionStorage, credentialProvider) {
       this.sessionStorage = sessionStorage;
       this.credentialProvider = credentialProvider;
   }
   
   setCredentialKey(credentialKey) {
       this.credentialKey = credentialKey;
       return this;
   }
   
   async login(username, password) {
       let foundCredential = await this.credentialProvider.provide(username, password);
       this.sessionStorage.set(this.credentialKey, foundCredential);
   }
}

module.exports = SessionAuth;