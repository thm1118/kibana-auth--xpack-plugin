import getClient from './get_client_shield';
import {basicAuth, parseHeader }from './basic_auth';
import _ from 'lodash';


export default function getUserProvider(server) {
    // const callWithRequest = getClient(server).callWithRequest;

    let users = server.config().get('security.users');

  server.expose('getUser', (request) => {
    // const xpackInfo = server.plugins.xpack_main.info;
    // if (xpackInfo && xpackInfo.isAvailable() && !xpackInfo.feature('security').isEnabled()) {
    //   return Promise.resolve(null);
    // }
    // return callWithRequest(request, 'shield.authenticate');
      server.log(["warn", "getUser"], "开始读取request头");
      let { username, password } =  parseHeader(request.headers["authorization"]);
      server.log(["warn", "getUser"], "结束读取request头"+username+password);
      let user = _.find(users, { 'username': username, 'password': password });
      if(user != undefined){
          user = _.omit(user, 'password');
          return Promise.resolve(user);
      }else{
          throw new Error('用户名或口令错误！请重新登陆');
      }

  });
};
