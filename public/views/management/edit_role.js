import _ from 'lodash';
import routes from 'ui/routes';
import {toggle} from 'plugins/security/lib/util';
import template from 'plugins/security/views/management/edit_role.html';
import 'angular-ui-select';
import 'plugins/security/services/shield_user';
import 'plugins/security/services/shield_role';
import 'plugins/security/services/shield_privileges';
import 'plugins/security/services/shield_indices';
import IndexPatternsProvider from 'ui/index_patterns/index_patterns';
import checkLicenseError from 'plugins/security/lib/check_license_error';

routes.when('/management/elasticsearch/roles/edit/:name?', {
  template,
  resolve: {
    role($route, ShieldRole) {
      const name = $route.current.params.name;
      if (name != null) return ShieldRole.get({name});
      return new ShieldRole({
        cluster: [],
        indices: [],
        run_as: []
      });
    },
    users(ShieldUser, kbnUrl, Promise, Private) {
      // $promise is used here because the result is an ngResource, not a promise itself
      return ShieldUser.query().$promise
      .then(users => _.map(users, 'username'))
      .catch(checkLicenseError(kbnUrl, Promise, Private));
    },
    indexPatterns(Private) {
      const indexPatterns = Private(IndexPatternsProvider);
      return indexPatterns.getIds();
    }
  },
  controller($scope, $route, $location, shieldPrivileges, shieldIndices, Notifier) {
    $scope.role = $route.current.locals.role;
    $scope.users = $route.current.locals.users;
    $scope.indexPatterns = $route.current.locals.indexPatterns;
    $scope.privileges = shieldPrivileges;
    $scope.view = {
      isNewRole: $route.current.params.name == null,
      fieldOptions: {}
    };

    const notifier = new Notifier();

    $scope.deleteRole = (role) => {
      if (!confirm('Are you sure you want to delete this role? This action is irreversible!')) return;
      role.$delete()
      .then(() => notifier.info('The role has been deleted.'))
      .then($scope.goToRoleList)
      .catch(error => notifier.error(_.get(error, 'data.message')));
    };

    $scope.saveRole = (role) => {
      role.indices = role.indices.filter((index) => index.names.length);
      role.indices.forEach((index) => index.query || delete index.query);
      role.$save()
      .then(() => notifier.info('The role has been updated.'))
      .then($scope.goToRoleList)
      .catch(error => notifier.error(_.get(error, 'data.message')));
    };

    $scope.goToRoleList = () => {
      $location.path('/management/elasticsearch/roles');
    };

    $scope.addIndex = (indices) => {
      indices.push({names: [], privileges: [], field_security: { grant: ['*']}});
    };

    $scope.areIndicesValid = (indices) => {
      return indices
        .filter((index) => index.names.length)
        .find((index) => index.privileges.length === 0) == null;
    };

    $scope.fetchFieldOptions = (index) => {
      const indices = index.names.join(',');
      const fieldOptions = $scope.view.fieldOptions;
      if (indices && fieldOptions[indices] == null) {
        shieldIndices.getFields(indices)
        .then((fields) => fieldOptions[indices] = fields)
        .catch(() => fieldOptions[indices] = []);
      }
    };

    $scope.$watch('role.indices', (indices) => {
      if (!indices.length) $scope.addIndex(indices);
      else indices.forEach($scope.fetchFieldOptions);
    }, true);

    $scope.toggle = toggle;
    $scope.includes = _.includes;
    $scope.union = _.flow(_.union, _.compact);
  }
});
