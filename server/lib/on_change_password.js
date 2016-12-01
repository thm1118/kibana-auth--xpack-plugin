export default (request, username, password, calculateExpires, reply) => {
  return () => {
    const currentUser = request.auth.credentials.username;
    if (username === currentUser) {
      request.auth.session.set({
        username,
        password,
        expires: calculateExpires()
      });
    }

    return reply().code(204);
  };
};
