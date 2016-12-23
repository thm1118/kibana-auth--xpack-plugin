const crypto = require('crypto');

export default (config, log) => {
  if (config.get('security.encryptionKey') == null) {
    log('为security.encryptionKey生成随机key. 服务重启后，会话会失效，在 ' +
      'kibana.yml 内设置设置security.encryptionKey 会保持会话');

    config.set('security.encryptionKey', crypto.randomBytes(16).toString('hex'));
  } else if (config.get('security.encryptionKey').length < 32) {
    throw new Error('security.encryptionKey 至少需要 32 个字符.');
  }

  const isSslConfigured = config.get('server.ssl.key') != null && config.get('server.ssl.cert') != null;
  if (!isSslConfigured) {
    if (config.get('security.secureCookies')) {
      log('使用加密cookies, 但是SSL 在Kibana内未启用. SSL 必须在 Kibana之外配置才能正常 ' +
        '功能.');
    } else {
      log('会话cookies 将在不安全连接上传递');
    }
  } else {
    config.set('security.secureCookies', true);
  }

    if (config.get('security.users') == null) {
        throw new Error('需要在 kibana.yml 内配置，设置security.users');
    }else{
        log('检测到 已在kibana.yml 内配置了security.users');
    }

};
