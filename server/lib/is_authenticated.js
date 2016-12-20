export default function isAuthenticatedProvider(server) {
  server.expose('isAuthenticated', async (request) => {
    try {
      // ensure that the user is authenticated
      await server.plugins.security.getUser(request);
      return true;
    } catch (err) {
      if (!err.isBoom || err.output.statusCode !== 401) {
        // don't swallow server errors
        throw err;
      }
    }

    return false;
  });
}
