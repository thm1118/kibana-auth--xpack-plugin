import 'plugins/security/views/management/users';
import 'plugins/security/views/management/roles';
import 'plugins/security/views/management/edit_user';
import 'plugins/security/views/management/edit_role';
import 'plugins/security/views/management/management.less';
import routes from 'ui/routes';
// import XPackInfoProvider from 'plugins/xpack_main/services/xpack_info';
import '../../services/shield_user';

import management from 'ui/management';

routes.defaults(/\/management/, {
    resolve: {
        securityManagementSection: function (ShieldUser, Private) {
            // const xpackInfo = Private(XPackInfoProvider);
            const elasticsearch = management.getSection('elasticsearch');
            // const showSecurityLinks = xpackInfo.get('features.security.showLinks');
            const showSecurityLinks = true;
            function deregisterSecurity() {
                elasticsearch.deregister('users');
                elasticsearch.deregister('roles');
            }

            function registerSecurity() {
                if (!elasticsearch.hasItem('users')) {
                    elasticsearch.register('users', {
                        order: 10,
                        display: 'Users',
                        url: '#/management/elasticsearch/users'
                    });
                }

                //todo: only use users, hide roles
                // if (!elasticsearch.hasItem('roles')) {
                //     elasticsearch.register('roles', {
                //         order: 20,
                //         display: 'Roles',
                //         url: '#/management/elasticsearch/roles'
                //     });
                // }
            }

            deregisterSecurity();
            if (!showSecurityLinks) return;

            // getCurrent will reject if there is no authenticated user, so we prevent them from seeing the security
            // management screens
            //
            // $promise is used here because the result is an ngResource, not a promise itself
            return ShieldUser.getCurrent().$promise
                .then(registerSecurity)
                .catch(deregisterSecurity);
        }
    }
});
