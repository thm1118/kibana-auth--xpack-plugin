# kibana-auth--xpack-plugin

Simplistic Authentication & Login generic plugin for Kibana 5.0.1
extract security plugin  from x-pack for learning kibana develop, Please use Elastics's x-Pack for a supported product.

username and password is hard code in server javascript now.
username: kibana, password:changeme

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