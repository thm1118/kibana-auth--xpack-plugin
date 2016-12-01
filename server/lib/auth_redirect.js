import Boom from 'boom';
import Promise from 'bluebird';
import { contains, get, has } from 'lodash';

const ROUTE_TAG_API = 'api';
const KIBANA_XSRF_HEADER = 'kbn-xsrf';
const KIBANA_VERSION_HEADER = 'kbn-version';

/**
 * Creates a hapi authenticate function that conditionally
 * redirects on auth failure
 *
 * Kibana requires a `kbn-xsrf` header or a `kbn-version` for xhr requests, so
 * it is probably the safest measure we have for determining whether a request
 * should return a 401 or a 302 when authentication fails.
 *
 * @param {object}
 *    onError:     Transform function that error is passed to before deferring
 *                 to standard error handler
 *    redirectUrl: Transform function that request path is passed to before
 *                 redirecting
 *    strategy:    The name of the auth strategy to use for test, or an array of auth strategy names
 *    testRequest: Function to test authentication for a request
 * @return {Function}
 */
export default function factory({ redirectUrl, strategies, testRequest, xpackMainPlugin }) {
  const testRequestAsync = Promise.promisify(testRequest);
  return function authenticate(request, reply) {
    // If security is disabled or license is basic, continue with no user credentials and delete the client cookie as well
    // const xpackInfo = xpackMainPlugin && xpackMainPlugin.info;
    // if (xpackInfo
    //     && xpackInfo.isAvailable()
    //     && (!xpackInfo.feature('security').isEnabled() || xpackInfo.license.isOneOf('basic'))) {
    //   reply.continue({ credentials: {} });
    //   return;
    // }

    // Test the request against all of the authentication strategies and if any succeed, continue
    return Promise.any(strategies.map((strategy) => testRequestAsync(strategy, request)))
    .then((credentials) => reply.continue({ credentials }))
    .catch(() => {
      if (shouldRedirect(request)) {
        reply.redirect(redirectUrl(request.url.path));
      } else {
        reply(Boom.unauthorized());
      }
    });
  };
};

export function shouldRedirect(request) {
  const hasVersionHeader = has(request.raw.req.headers, KIBANA_VERSION_HEADER);
  const hasXsrfHeader = has(request.raw.req.headers, KIBANA_XSRF_HEADER);

  const isApiRoute = contains(get(request, 'route.settings.tags'), ROUTE_TAG_API);
  const isAjaxRequest = hasVersionHeader || hasXsrfHeader;

  return !isApiRoute && !isAjaxRequest;
};
