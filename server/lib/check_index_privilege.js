import Boom from 'boom';
import { wrapError } from './errors';
import _ from 'lodash';

export default function checkIndexPrivilege(server) {

    /** todo: is this enough？*/
    const re = /^\/elasticsearch\/.*?\/_field_stats/;

    server.ext({
        type: 'onPreHandler',
        method: function (request, reply) {

            server.log(["info", "onPreHandler事件"], request.url.path);

            if (re.test(request.url.path)){
                let ps = request.url.path.trim().split('/');
                let index_name = ps[2];
                server.log(["info", "索引名"],index_name);
                return   server.plugins.security.getUser(request).then(function (user) {
                    // todo:  server.log not work here ,why?
                    // server.log(["warn", "onPreHandler事件: user.index"], user);
                    if(user.index != '*' && index_name != user.index) {
                        // server.log(["warn", "onPreHandler事件"], "==============索引不匹配==========");
                        return reply(Boom.forbidden("无权访问"));
                    }else{
                        return reply.continue();
                    }
                }, _.flow(wrapError, reply));

            }else {
                return reply.continue();
            }
        }
    });
};
