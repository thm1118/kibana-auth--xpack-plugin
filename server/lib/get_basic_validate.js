import getIsValidUser from './get_is_valid_user';

export default (server) => {
  const isValidUser = getIsValidUser(server);

  return function validate(request, username, password, callback) {
    return isValidUser(request, username, password).then(
      () => callback(null, true, {username, password}),
      (error) => callback(error, false)
    );
  };
};
