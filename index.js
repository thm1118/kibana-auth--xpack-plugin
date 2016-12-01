import exampleRoute from './server/routes/example';

import hapiAuthBasic from 'hapi-auth-basic';
import hapiAuthCookie from 'hapi-auth-cookie';
import {resolve} from 'path';
import Promise from 'bluebird';
import getBasicValidate from './server/lib/get_basic_validate';
import getCookieValidate from './server/lib/get_cookie_validate';
import createExpose from './server/lib/create_expose';
import initAuthenticateApi from './server/routes/api/v1/authenticate';
import initUsersApi from './server/routes/api/v1/users';
import initRolesApi from './server/routes/api/v1/roles';
import initIndicesApi from './server/routes/api/v1/indices';
import initLoginView from './server/routes/views/login';
import initLogoutView from './server/routes/views/logout';
import validateConfig from './server/lib/validate_config';
import setElasticsearchAuth from './server/lib/set_elasticsearch_auth';
import createScheme from './server/lib/login_scheme';
// import checkLicense from './server/lib/check_license';
// import mirrorPluginStatus from '../../server/lib/mirror_plugin_status';

export default function (kibana) {
    return new kibana.Plugin({
        id: 'security',
        // configPrefix: 'xpack.security',
        // publicDir: resolve(__dirname, 'public'),
        require: ['kibana', 'elasticsearch'],

        uiExports: {
            chromeNavControls: ['plugins/security/views/nav_control'],
            managementSections: ['plugins/security/views/management'],
            apps: [{
                id: 'login',
                title: '登陆',
                main: 'plugins/security/views/login',
                hidden: true,
                injectVars(server) {
                    const pluginId = 'security';
                    // const xpackInfo = server.plugins.xpack_main.info;
                    //const {showLogin, loginMessage, allowLogin} = xpackInfo.feature(pluginId).getLicenseCheckResults() || {};
                    const {showLogin, loginMessage, allowLogin} = {"showLogin":true, "loginMessage":"登录吧登陆吧", "allowLogin":true};

                    return {
                        loginState: {
                            showLogin,
                            allowLogin,
                            loginMessage
                        }
                    };
                }
            },
                {
                    id: 'logout',
                    title: '注销',
                    main: 'plugins/security/views/logout',
                    hidden: true
                },
                {
                    title: '插件开发测试',
                    description: '测试开发API和插件功能',
                    main: 'plugins/security/app',
                    icon: 'plugins/security/icon.svg'
                }],
            hacks: [
                'plugins/security/hacks/on_session_timeout',
                'plugins/security/hacks/on_unauthorized_response',
                'plugins/security/hacks/hack'
            ],
            injectDefaultVars: function (server) {

                const config = server.config();
                return {
                    secureCookies: config.get('security.secureCookies'),
                    sessionTimeout: config.get('security.sessionTimeout')
                };
            }
        },

        config(Joi) {
            return Joi.object({
                enabled: Joi.boolean().default(true),
                cookieName: Joi.string().default('sid'),
                encryptionKey: Joi.string(),
                sessionTimeout: Joi.number().allow(null).default(null),
                secureCookies: Joi.boolean().default(false)
            }).default();
        },
        preInit(server) {
            setElasticsearchAuth(server.config());
        },
        /**
         * 注册服务端API
         * */
        init(server, options) {
            // Add server routes and initalize the plugin here
            exampleRoute(server);

            const thisPlugin = this;
            // const xpackMainPlugin = server.plugins.xpack_main;
            // mirrorPluginStatus(xpackMainPlugin, thisPlugin);
            // xpackMainPlugin.status.once('green', () => {
            //     // Register a function that is called whenever the xpack info changes,
            //     // to re-compute the license check results for this plugin
            //     xpackMainPlugin.info.feature(thisPlugin.id).registerLicenseCheckResultsGenerator(checkLicense);
            // });

            const config = server.config();
            validateConfig(config, message => server.log(['security', 'warning'], message));

            const cookieName = config.get('security.cookieName');

            const register = Promise.promisify(server.register, {context: server});
            Promise.all([
                register(hapiAuthBasic),
                register(hapiAuthCookie)
            ])
                .then(() => {
                    server.auth.scheme('login', createScheme({
                        redirectUrl: (path) => loginUrl(config.get('server.basePath'), path),
                        strategies: ['security-cookie', 'security-basic']
                    }));

                    server.auth.strategy('session', 'login', 'required');

                    server.auth.strategy('security-basic', 'basic', false, {
                        validateFunc: getBasicValidate(server)
                    });

                    server.auth.strategy('security-cookie', 'cookie', false, {
                        cookie: cookieName,
                        password: config.get('security.encryptionKey'),
                        clearInvalid: true,
                        validateFunc: getCookieValidate(server),
                        isSecure: config.get('security.secureCookies'),
                        path: config.get('server.basePath') + '/'
                    });
                });

            createExpose(server);

            initAuthenticateApi(server);
            initUsersApi(server);
            initRolesApi(server);
            initIndicesApi(server);
            initLoginView(server, thisPlugin);
            initLogoutView(server, thisPlugin);
        }


    });
};

function loginUrl(baseUrl, requestedPath) {
    const next = encodeURIComponent(requestedPath);
    return `${baseUrl}/login?next=${next}`;
}
