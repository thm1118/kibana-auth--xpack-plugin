import {USERNAME, PASSWORD} from './default_auth';

export default (config) => {
  const {username, password} = config.get('elasticsearch');
  if (!username) config.set('elasticsearch.username', USERNAME);
  if (!password) config.set('elasticsearch.password', PASSWORD);
};
