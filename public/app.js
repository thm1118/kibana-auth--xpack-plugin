import moment from 'moment';
import chrome from 'ui/chrome';
import uiModules from 'ui/modules';
import uiRoutes from 'ui/routes';
/** 这里导入 公共客户端API的 es 服务， 这里导入后，才能在下面 进行自动注入*/
import 'ui/es'
import 'ui/autoload/styles';
import './less/main.less';
import template from './templates/index.html';
import detailTemplate from './templates/detail.html';
import 'angular-ui-grid/ui-grid'
import 'angular-ui-grid/ui-grid.css'
import 'angular-ui-grid/ui-grid.svg'
import 'angular-ui-grid/ui-grid.ttf'
import 'angular-ui-grid/ui-grid.woff'

/** 启动和配置 客户端路由 */
uiRoutes.enable();
uiRoutes
    .when('/', {
        template,
        controller: 'testPluginHelloWorld',
        controllerAs: 'ctrl',
        resolve: {
            currentTime($http) {
                /** 这里演示在客户端 调用自己实现的 服务端API */
                return $http.get('../api/test_plugin/example').then(function (resp) {
                    return resp.data.time;
                });
            }
        }
    })
    .when('/index/:name', {
        template: detailTemplate,
        controller: 'elasticsearchDetailController',
        controllerAs: 'ctrl'
    })
;

uiModules.get('app/test_plugin', ['ui.grid'])
    .controller('testPluginHelloWorld', function ($scope, $route, $interval, $http, es, esFactory) {
        $scope.title = "自定义插件";
        $scope.description = '测试kibana插件开发';

        /** 使用 es 服务，
         * 具体api查看 https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/index.html
         * */
        es.cluster.state({
            metric: [
                'cluster_name',
                'nodes',
                'master_node',
                'version'
            ]
        })
            .then(function (resp) {
                $scope.clusterState = resp;
                $scope.error = null;
            })
            .catch(function (err) {
                $scope.clusterState = null;
                $scope.error = err;

                // 如果是NoConnections异常, 客户端就无法连接到es，需要更详细错误信息
                if (err instanceof esFactory.errors.NoConnections) {
                    $scope.error = new Error('无法连接到 elasticsearch. ' +
                        '确认是否存在有效服务： http://localhost:9200');
                }
            });


        $http.get('../api/elasticsearch_status/indices').then((response) => {
            $scope.indices = response.data;
        });

        let currentTime = moment($route.current.locals.currentTime);
        $scope.currentTime = currentTime.format('HH:mm:ss');
        let unsubscribe = $interval(function () {
            $scope.currentTime = currentTime.add(1, 'second').format('HH:mm:ss');
        }, 1000);
        $scope.$watch('$destroy', unsubscribe);


        $scope.myData = [
            {
                "firstName": "Cox",
                "lastName": "Carney",
                "company": "Enormo",
                "employed": true
            },
            {
                "firstName": "Lorraine",
                "lastName": "Wise",
                "company": "Comveyer",
                "employed": false
            },
            {
                "firstName": "Nancy",
                "lastName": "Waters",
                "company": "Fuelton",
                "employed": false
            }
        ];
    })

    .controller('elasticsearchDetailController', function($routeParams, $http) {
        this.index = $routeParams.name;
        $http.get(`../api/elasticsearch_status/index/${this.index}`).then((response) => {
            this.status = response.data;
        });
    });
