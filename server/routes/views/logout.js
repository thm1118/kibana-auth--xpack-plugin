export default (server, uiExports) => {
  const logout = uiExports.apps.byId.logout;

  server.route({
    method: 'GET',
    path: '/logout',
    handler(request, reply) {
      return reply.renderAppWithDefaultConfig(logout);
    },
    config: {
      auth: false
    }
  });
};
