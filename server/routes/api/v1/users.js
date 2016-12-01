import _ from 'lodash';
import Boom from 'boom';
import Joi from 'joi';
import getClient from '../../../lib/get_client_shield';
import userSchema from '../../../lib/user_schema';
import { wrapError } from '../../../lib/errors';
import getCalculateExpires from '../../../lib/get_calculate_expires';
import onChangePassword from '../../../lib/on_change_password';
import getIsValidUser from '../../../lib/get_is_valid_user';
import routePreCheckLicense from '../../../lib/route_pre_check_license';

export default (server) => {
  const callWithRequest = getClient(server).callWithRequest;
  const calculateExpires = getCalculateExpires(server);
  const isValidUser = getIsValidUser(server);
  const routePreCheckLicenseFn = routePreCheckLicense(server);

  server.route({
    method: 'GET',
    path: '/api/security/v1/users',
    handler(request, reply) {
      // return callWithRequest(request, 'shield.getUser').then(
      //   (response) => reply(_.values(response)),
      //   _.flow(wrapError, reply)
      // );
        //todo: 根据客户端js ，模拟这个对象，还需要处理异常
        response = [{"username": "kibana", "roles":"admin?","full_name": "", "email":"","metadata":"", "enabled":true}];
        reply(_.values(response))
    },
    // config: {
    //   pre: [routePreCheckLicenseFn]
    // }
  });

  server.route({
    method: 'GET',
    path: '/api/security/v1/users/{username}',
    handler(request, reply) {
      const username = request.params.username;
      // return callWithRequest(request, 'shield.getUser', {username}).then(
      //   (response) => {
      //     if (response[username]) return reply(response[username]);
      //     return reply(Boom.notFound());
      //   },
      //   _.flow(wrapError, reply));
        //todo: 不写死
        return reply(username);
    },
    // config: {
    //   pre: [routePreCheckLicenseFn]
    // }
  });

  server.route({
    method: 'POST',
    path: '/api/security/v1/users/{username}',
    handler(request, reply) {
      const username = request.params.username;
      const body = _(request.payload).omit(['username', 'enabled']).omit(_.isNull);
      // return callWithRequest(request, 'shield.putUser', {username, body}).then(
      //   () => reply(request.payload),
      //   _.flow(wrapError, reply));
        /** todo：这应该是新增或修改用户信息，*/
        return reply({"username": "kibana", "roles":"admin?","full_name": "", "email":"","metadata":"", "enabled":true})
    },
    config: {
      validate: {
        payload: userSchema
      },
      // pre: [routePreCheckLicenseFn]
    }
  });

  server.route({
    method: 'DELETE',
    path: '/api/security/v1/users/{username}',
    handler(request, reply) {
      const username = request.params.username;
      // return callWithRequest(request, 'shield.deleteUser', {username}).then(
      //   () => reply().code(204),
      //   _.flow(wrapError, reply));
        /** todo:我们不应该 删除用户？*/
        reply().code(204);
    },
    // config: {
    //   pre: [routePreCheckLicenseFn]
    // }
  });

  server.route({
    method: 'POST',
    path: '/api/security/v1/users/{username}/password',
    handler(request, reply) {
      const username = request.params.username;
      const {password, newPassword} = request.payload;

      let promise = Promise.resolve();
      if (username === request.auth.credentials.username) promise = isValidUser(request, username, password);

      // return promise.then(() => {
      //   const body = {password: newPassword};
      //   return callWithRequest(request, 'shield.changePassword', {username, body})
      //   .then(onChangePassword(request, username, newPassword, calculateExpires, reply))
      //   .catch(_.flow(wrapError, reply));
      // })
      // .catch((error) => reply(Boom.unauthorized(error)));
      /** todo: 这样仅仅是session中修改密码，是否允许？*/
        onChangePassword(request, username, newPassword, calculateExpires, reply);
    },
    config: {
      validate: {
        payload: {
          password: Joi.string(),
          newPassword: Joi.string().required()
        }
      },
      // pre: [routePreCheckLicenseFn]
    }
  });
};
