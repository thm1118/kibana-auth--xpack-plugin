import _ from 'lodash';
import routes from 'ui/routes';
import template from './account.html';
import './account.less';
import '../../services/shield_user';

routes.when('/account', {
  template,
  resolve: {
    user(ShieldUser) {
      return ShieldUser.getCurrent();
    }
  },
  controller($scope, $route, Notifier) {
    $scope.user = $route.current.locals.user;
    $scope.view = {
      changePasswordMode: false,
      incorrectPassword: false
    };

    const notifier = new Notifier();

    $scope.changePassword = (user) => {
      user.$changePassword()
      .then(() => notifier.info('口令已变更.'))
      .then($scope.toggleChangePasswordMode)
      .catch((error) => {
        if (error.status === 401) $scope.view.incorrectPassword = true;
        else notifier.error(_.get(error, 'data.message'));
      });
    };

    $scope.$watch('user.password', () => $scope.view.incorrectPassword = false);

    $scope.toggleChangePasswordMode = () => {
      delete $scope.user.password;
      delete $scope.user.newPassword;
      delete $scope.view.confirmPassword;
      $scope.view.changePasswordMode = !$scope.view.changePasswordMode;
    };
  }
});
