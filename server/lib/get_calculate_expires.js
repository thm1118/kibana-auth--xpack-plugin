export default (server) => {
  const ttl = server.config().get('security.sessionTimeout');
  return () => ttl && Date.now() + ttl;
};
