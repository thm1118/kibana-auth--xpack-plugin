import {once} from 'lodash';
import elasticsearchShield from './elasticsearch-shield-js/elasticsearch-shield';

export default once((server) => {
  const createClient = server.plugins.elasticsearch.createClient;
  const client = createClient({
    auth: false,
    //  这个插件应该 是用来访问es 端插件的
    // plugins: [elasticsearchShield]
  });

  const callWithRequestFactory = server.plugins.elasticsearch.callWithRequestFactory;
  const callWithRequest = callWithRequestFactory(client);

  return {client, callWithRequest};
});
