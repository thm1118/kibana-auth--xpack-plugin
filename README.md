# kibana-auth--xpack-plugin

Simplistic Authentication & Login generic plugin for Kibana 5.1.1.

extract security plugin  from x-pack for learning kibana develop, Please use Elastics's x-Pack for a supported product.


## install 

username and password are configed in kibana.yml . user only access configed index name. index name suport wildcard character *

    security:
      encryptionKey: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
      cookieName: 'mycookie'
      users: [{'username':'kibana', 'password':'changeme','full_name':'内置管理员', 'index':'logstash-*','metadata':{'_reserved':true}},{'username':'log2', 'password':'changeme','index':'log2-*','metadata':{'_reserved':true}}]

username: kibana, password:changeme ,log2/changeme.

"kibana" user hard code as administrator

after config kibana.yml , run `kibana-plugin install  https://github.com/thm1118/kibana-auth--xpack-plugin/releases/download/5.1.1/security-0.0.4.zip` to install .

![preview](img/login.png)


## development

See the [kibana contributing guide](https://github.com/elastic/kibana/blob/master/CONTRIBUTING.md) for instructions setting up your development environment. Once you have completed that, use the following npm tasks.

  - `npm start`

    Start kibana and have it include this plugin

  - `npm start -- --config kibana.yml`

    You can pass any argument that you would normally send to `bin/kibana` by putting them after `--` when running `npm start`

  - `npm run build`

    Build a distributable archive

  - `npm run test:browser`

    Run the browser tests in a real web browser

  - `npm run test:server`

    Run the server tests using mocha

For more information about any of these commands run `npm run ${task} -- --help`.