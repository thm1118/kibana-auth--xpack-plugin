import Boom from 'boom';
import { wrapError } from './errors';
import _ from 'lodash';

export default function checkIndexPrivilege(server) {

    // const fakeNoResult = JSON.parse('{"responses":[{"took":5,"timed_out":false,"_shards":{"total":1,"successful":1,"failed":0},"hits":{"total":0,"max_score":null,"hits":[]},"status":200}]}');

    let compareIndex = function(config_index, query_index){
        /** 这里的索引名不一定是通配符形式的，需要与配置的 通配符形式索引做对应比较 */
        let conifgIndex = config_index;
        let queryIndex = query_index;
        if(config_index !== null && config_index.length >=2 && query_index.length >=2 && config_index[config_index.length -1] === '*'){
            conifgIndex = config_index.substr(0, config_index.length - 2);
            queryIndex = query_index.substr(0, query_index.length - 2);
        }
        return conifgIndex === queryIndex;
    };
    server.ext({
        type: 'onPreHandler',
        method: function (request, reply) {

            server.log(["debug", "onPreHandler事件 path"], request.path);

            if (/^\/elasticsearch\/.*?\/_field_stats/.test(request.url.path)){
                /** index-patter configed is 'Index contains time-based events', these index query will first call elasticsearch/index /_field_stats */
                let ps = request.url.path.trim().split('/');
                let index_name = ps[2];
                server.log(["info", "onPreHandler事件 请求索引名"],index_name);
                server.plugins.security.getUser(request).then(function (user) {
                    // todo:  server.log not work here ,why?
                    server.log(["warn", "onPreHandler事件: user.index"], user);
                    if(user.index != '*' && index_name != user.index) {
                        // server.log(["warn", "onPreHandler事件"], "==============索引不匹配==========");
                        return reply(Boom.forbidden("无权访问"));
                    }else{
                        return reply.continue();
                    }
                }, _.flow(wrapError, reply));

            }else if(request.path === '/elasticsearch/_msearch') {
                /** index-patter configed not 'Index contains time-based events', these index query will first call /elasticsearch/_msearch*/
                    server.log(["info", "======onRequest事件--payload"], request.path);
                    let req = request.raw.req;

                let payload ={};
                try {
                            /**  _msearch's post payload ，string which included several json string, need split then convert to json
                             * todo： config query condition
                             *
                             * {"index":["shakes*"],"ignore_unavailable":true,"preference":1482376224021}
                             {"size":500,"sort":[{"_score":{"order":"desc"}}],"query":{"query_string":{"analyze_wildcard":true,"query":"*"}},"highlight":{"pre_tags":["@kibana-highlighted-field@"],"post_tags":["@/kibana-highlighted-field@"],"fields":{"*":{}},"require_field_match":false,"fragment_size":2147483647},"_source":{"excludes":[]},"stored_fields":["*"],"script_fields":{},"docvalue_fields":[]}
                             {"query":{"bool":{"must_not":[{"match_all":{}}]}}}
                             * */
                    let payloadstr = req._readableState.buffer.tail.data.toString();
                    server.log(["debug", "======onPreHandler事件--payloadstr---all"], payloadstr);
                    let first = payloadstr.indexOf('}');
                    payloadstr = payloadstr.substr(0, first+1);
                    server.log(["debug", "======onPreHandler事件--payloadstr---index"], payloadstr);
                        payload = JSON.parse(payloadstr);
                    } catch (err) {
                        server.log(["err", "======onPreHandler事件--payload--error"], err);
                        return _.flow(wrapError, reply);
                    }
                        server.log(["debug", "======onPreHandler事件--payload-index-json"], payload);

                        let index_name = payload.index[0];
                        server.log(["info", "======onPreHandler事件--payload-index-jso 请求索引名 index"], index_name);
                        return server.plugins.security.getUser(request).then(function (user) {
                            if(user.index !== '*' && index_name !== '.kibana' && !compareIndex(user.index, index_name)) {
                                return reply(Boom.forbidden("无权访问"));
                                // return reply(fakeNoResult);
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
