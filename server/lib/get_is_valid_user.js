import {assign} from 'lodash';
import basicAuth from './basic_auth';

export default (server) => {
  return function isValidUser(request, username, password) {
    assign(request.headers, basicAuth.getHeader(username, password));
    return server.plugins.security.getUser(request);
  };
};
