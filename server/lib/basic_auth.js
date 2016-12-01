export default {
  getHeader: getAuthHeader,
  parseHeader: parseAuthHeader
};

function getAuthHeader(username, password) {
  const auth = new Buffer(`${username}:${password}`).toString('base64');
  return {
    authorization: `Basic ${auth}`
  };
}

function parseAuthHeader(authorization) {
  if (typeof authorization !== 'string') {
    throw new Error('Authorization should be a string');
  }

  const [ authType, token ] = authorization.split(' ');
  if (authType.toLowerCase() !== 'basic') {
    throw new Error('Authorization is not Basic');
  }

  // base64 decode auth header
  const tokenBuffer = new Buffer(token, 'base64');
  const tokenString = tokenBuffer.toString();

  // parse auth data
  let [ username, ...password ] = tokenString.split(/:/);
  password = password.join(':');

  return { username, password };
}
