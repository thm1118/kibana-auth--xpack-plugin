import { parse } from 'url';
import { get } from 'lodash';
import 'ui/autoload/styles';
import 'plugins/security/views/login/login.less';
import chrome from 'ui/chrome';
import parseNext from 'plugins/security/lib/parse_next';
import template from 'plugins/security/views/login/login.html';

const messageMap = {
  SESSION_EXPIRED: '会话已过期，请重新登陆.'
};

chrome
.setVisible(false)
.setRootTemplate(template)
.setRootController('login', function ($http, $window, secureCookies, loginState) {
  const next = parseNext($window.location);
  const isSecure = !!$window.location.protocol.match(/^https/);
  const self = this;

  function setupScope() {
    const defaultLoginMessage = '输入用户名和口令登陆';

    self.allowLogin = loginState.allowLogin;
    self.loginMessage = loginState.loginMessage || defaultLoginMessage;
    self.infoMessage = get(messageMap, parse($window.location.href, true).query.msg);
    self.isDisabled = !isSecure && secureCookies;
    self.isLoading = false;
    self.submit = (username, password) => {
      self.isLoading = true;
      self.error = false;
      $http.post('./api/security/v1/login', {username, password}).then(
        () => $window.location.href = `.${next}`,
        () => {
          setupScope();
          self.error = true;
          self.isLoading = false;
        }
      );
    };
  }

  setupScope();
});
