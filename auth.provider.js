const SessionAuth = require('./session-auth');
const DatabaseCredentialProvider = require('./database-credentia-provider');


exports.register = (container) => {
    container.singleton('auth.session', async() => {
        let config = await container.make('config');
        
        return new SessionAuth(
            new DatabaseCredentialProvider(await container.make('database'), await container.make('hash'))
                .setIdentityField(config.auth.session.identityField)
                .setTable(config.auth.session.credentialTable)
        ).setCredentialKey(config.auth.session.credentialKey);
    });
};

exports.boot = async(container) => {
    let httpKernel = await container.make('http.kernel');
    let authSession = await container.make('auth.session');
    httpKernel.use(async(ctx, next) => {
        authSession.setSession(ctx.session);
        await next();
    });
};