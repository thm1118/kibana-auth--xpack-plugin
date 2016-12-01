import {constant} from 'lodash';
import registry from 'ui/registry/chrome_nav_controls';
import uiModules from 'ui/modules';
import template from 'plugins/security/views/nav_control/nav_control.html';
import 'plugins/security/services/shield_user';
import '../account/account';
import PathProvider from 'plugins/security/services/path';

registry.register(constant({
  name: 'security',
  order: 1000,
  template
}));

const module = uiModules.get('security', ['kibana']);
module.controller('securityNavController', ($scope, ShieldUser, globalNavState, kbnBaseUrl, Private) => {

    const showSecurityLinks = true;
  if (Private(PathProvider).isLoginOrLogout() || !showSecurityLinks) return;

  $scope.user = ShieldUser.getCurrent();
  $scope.route = `${kbnBaseUrl}#/account`;

  $scope.formatTooltip = tooltip => {
    // 侧边栏展开状态，无需显示提示信息
    if (globalNavState.isOpen()) {
      return;
    }
    return tooltip;
  };
});
