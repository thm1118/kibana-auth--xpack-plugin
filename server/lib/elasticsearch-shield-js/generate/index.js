
var _ = require('lodash');
var fs = require('fs');
var resolve = require('path').resolve;
var relative = require('path').relative;
var glob = require('glob');
var imports = _.clone(require('./templateHelpers'));

var rootDir = resolve(__dirname, '..');
var apiDir = resolve(rootDir, '../../../../../../elasticsearch/x-pack/shield/src/test/resources/rest-api-spec/api');
var tmplDir = resolve(rootDir, 'generate/templates');
var apiFile = resolve(rootDir, 'elasticsearch-shield.js');
var docFile = resolve(rootDir, 'docs/api.asciidoc');

var read = function (filename) { return fs.readFileSync(filename, 'utf8'); };
var parseJson = function (contents) { return JSON.parse(contents); };
var Method = require('./Method');
var methods = glob
.sync(resolve(apiDir, 'shield.*.json'))
.map(read)
.map(parseJson)
.map(function (spec) {
  var name = Object.keys(spec).shift();
  return new Method(name, spec[name]);
});

glob.sync(resolve(tmplDir, '*.tmpl')).forEach(function (filename) {
  var file = relative(tmplDir, filename);
  var name = file.replace(/\.tmpl/, 'Tmpl');
  var tmpl;
  imports[name] = function (locals) {
    tmpl || (tmpl = _.template(read(filename), { sourceURL: filename, imports: imports }));
    return tmpl(locals);
  };
});

fs.writeFileSync(apiFile, imports.apiFileTmpl({ methods: methods }));
fs.writeFileSync(docFile, imports.docFileTmpl({ methods: methods }));
