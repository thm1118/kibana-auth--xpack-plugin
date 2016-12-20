import getIsValidUser from './get_is_valid_user';
import getCalculateExpires from './get_calculate_expires';

export default (server) => {
  const isValidUser = getIsValidUser(server);
  const calculateExpires = getCalculateExpires(server);
  const { isSystemApiRequest } = server.plugins.kibana.systemApi;

  return function validate(request, session, callback) {
    if (hasSessionExpired(session)) return callback(new Error('Session has expired'), false);

    const {username, password} = session;
    return isValidUser(request, username, password).then(
      () => {
        // Extend the session timeout provided this is NOT a system API call
        if (!isSystemApiRequest(request)) {
          // Keep the session alive
          request.cookieAuth.set({
            username,
            password,
            expires: calculateExpires()
          });
        }
        return callback(null, true);
      },
      (error) => callback(error, false)
    );
  };
};

export function hasSessionExpired(session) {
  const {expires} = session;
  return !!(expires && expires < Date.now());
};
