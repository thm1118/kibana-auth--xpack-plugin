import chrome from 'ui/chrome';

export default function PathProvider($window) {
  const path = chrome.removeBasePath($window.location.pathname);
  return {
    isLoginOrLogout() {
      return path === '/login' || path === '/logout';
    }
  };
}
