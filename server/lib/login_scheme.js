import * as authRedirect from './auth_redirect';

/**
 * Creates a hapi auth scheme with conditional session
 * expiration handling based on each request
 *
 * @param {object}
 *    redirectUrl: Transform function that request path is passed to before
 *                 redirecting
 *    strategy:    The name of the auth strategy to use for test
 * @return {Function}
 */
export default function createScheme({ redirectUrl, strategies }) {
  return (server) => {
    const authenticate = authRedirect.default({
      redirectUrl,
      strategies,
      testRequest: server.auth.test,
      xpackMainPlugin: server.plugins.xpack_main
    });
    return { authenticate };
  };
}
