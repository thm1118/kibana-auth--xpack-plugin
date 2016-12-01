import getClient from './get_client_shield';
import {basicAuth, parseHeader }from './basic_auth';

export default function createExports(server) {
  const callWithRequest = getClient(server).callWithRequest;

  server.expose('getUser', (request) => {
    // const xpackInfo = server.plugins.xpack_main.info;
    // if (xpackInfo && xpackInfo.isAvailable() && !xpackInfo.feature('security').isEnabled()) {
    //   return Promise.resolve(null);
    // }
    //return callWithRequest(request, 'shield.authenticate');
      //todo: 这里 应该返回当前用户，对象格式？
     let { username, password } =  parseHeader(request.headers["authorization"]);


     if( username == "kibana" &&  password === "changeme"){
         let user = {"username":username, "full_name":"内置管理员", "email":"@@"};
         return Promise.resolve(user);
     }else {
         throw new Error('用户名或口令错误！请重新登陆');
     }

  });
};
