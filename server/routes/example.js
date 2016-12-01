export default function (server) {
    /**
     * 服务端API， 参照：http://hapijs.com/tutorials
     * */
    server.route({
        path: '/api/test_plugin/example',
        method: 'GET',
        handler(req, reply) {
            reply({time: (new Date()).toISOString()});
        }
    });


    /**
     *在index.js里require 服务端elasticsearch， 服务端elasticsearch 自身也是kibana服务的一个插件。
     * 注意在客户端中通常 直接用 公共angular es 服务来访问。两种方法 都是通过kibana代理访问es。
     *
     * 这里除了演示访问es的方法之一外，还为了演示 如何创建服务端API
     */
    let call = server.plugins.elasticsearch.callWithRequest;

    /**
     * 注册一个GET Api。 返回es内的所有索引名称的数组。
     * server 实际上是 一个HAPI server。 关于route 方法的完整文档参加： http://hapijs.com/api#serverrouteoptions
     * */
    server.route({
        path: '/api/elasticsearch_status/indices',
        method: 'GET',
        /**
         * handler 方法会在 对应path请求来时被调用，reply方法作为第二个参数，用于给客户端相应内容。
         * */
        handler(req, reply) {
            /**
             * callWithRequest 方法有以下语法：
             * 第1个参数： 来自客户端的请求，callWithRequest 方法会处理 传递来自kibana的验证信息 给 es。或返回验证请求等等。
             * 第二个参数：是调用的es 的js 函数名称，参见：https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/
             * 第三个参数：传递给es js函数的参数。
             *
             * 返回 一个promise，会在es实际返回数据时 resolve。因此需要用 then 来做后续处理
             * */
            call(req, 'cluster.state').then(function (response) {
                // 向客户端返回 所有索引的名称数组
                reply(
                    Object.keys(response.metadata.indices)
                );
            });
        }
    });

    // 根据索引名 返回该索引的状态信息
    server.route({
        /**
         * 在 path里设置 变量
         * */
        path: '/api/elasticsearch_status/index/{name}',
        method: 'GET',
        handler(req, reply) {
            call(req, 'cluster.state', {
                metric: 'metadata',
                index: req.params.name
            }).then(function (response) {
                reply(response.metadata.indices[req.params.name]);
            });
        }
    });

};
