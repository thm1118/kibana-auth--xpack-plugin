import _ from 'lodash';
import Boom from 'boom';
import getClient from '../../../lib/get_client_shield';
import roleSchema from '../../../lib/role_schema';
import { wrapError } from '../../../lib/errors';
import routePreCheckLicense from '../../../lib/route_pre_check_license';

export default (server) => {
  const callWithRequest = getClient(server).callWithRequest;
  const routePreCheckLicenseFn = routePreCheckLicense(server);

  server.route({
    method: 'GET',
    path: '/api/security/v1/roles',
    handler(request, reply) {
      // return callWithRequest(request, 'shield.getRole').then(
      //   (response) => {
      //     const roles = _.map(response, (role, name) => _.assign(role, {name}));
      //     return reply(roles);
      //   },
      //   _.flow(wrapError, reply)
      // );

        const roles = [{"rolename":" name"}];
        return reply(roles);

    },
    // config: {
    //   pre: [routePreCheckLicenseFn]
    // }
  });

  server.route({
    method: 'GET',
    path: '/api/security/v1/roles/{name}',
    handler(request, reply) {
      const name = request.params.name;
      // return callWithRequest(request, 'shield.getRole', {name}).then(
      //   (response) => {
      //     if (response[name]) return reply(_.assign(response[name], {name}));
      //     return reply(Boom.notFound());
      //   },
      //   _.flow(wrapError, reply));
        reply(_.assign("role_name", {name}));
    },
    // config: {
    //   pre: [routePreCheckLicenseFn]
    // }
  });

  server.route({
    method: 'POST',
    path: '/api/security/v1/roles/{name}',
    handler(request, reply) {
      const name = request.params.name;
      const body = _.omit(request.payload, 'name');
      // return callWithRequest(request, 'shield.putRole', {name, body}).then(
      //   () => reply(request.payload),
      //   _.flow(wrapError, reply));
        reply(request.payload);
    },
    config: {
      validate: {
        payload: roleSchema
      },
      // pre: [routePreCheckLicenseFn]
    }
  });

  server.route({
    method: 'DELETE',
    path: '/api/security/v1/roles/{name}',
    handler(request, reply) {
      const name = request.params.name;
      // return callWithRequest(request, 'shield.deleteRole', {name}).then(
      //   () => reply().code(204),
      //   _.flow(wrapError, reply));
        reply().code(204);
    },
    config: {
      // pre: [routePreCheckLicenseFn]
    }
  });
};
