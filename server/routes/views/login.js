import { get } from 'lodash';

export default (server, uiExports, xpackMainPlugin) => {
  const config = server.config();
  const cookieName = config.get('security.cookieName');
  const login = uiExports.apps.byId.login;

  server.route({
    method: 'GET',
    path: '/login',
    handler(request, reply) {

      // const xpackInfo = xpackMainPlugin && xpackMainPlugin.info;
      // const licenseCheckResults = xpackInfo && xpackInfo.isAvailable() && xpackInfo.feature('security').getLicenseCheckResults();
      // const showLogin = get(licenseCheckResults, 'showLogin');
        const showLogin = true;
      const isUserAlreadyLoggedIn = !!request.state[cookieName];
      if (isUserAlreadyLoggedIn || !showLogin) {
        const next = get(request, 'query.next', '/');
        return reply.redirect(`${config.get('server.basePath')}${next}`);
      }
      return reply.renderAppWithDefaultConfig(login);
    },
    config: {
      auth: false
    }
  });
};
