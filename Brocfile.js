/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp();

// Use `app.import` to add additional libraries to the generated
// output files.
//
// If you need to use different assets in different
// environments, specify an object as the first parameter. That
// object's keys should be the environment name and the values
// should be the asset to use in that environment.
//
// If the library that you are including contains AMD or ES6
// modules that you would like to import into your application
// please specify an object with the list of modules as keys
// along with the exports of each module as its value.

app.import('bower_components/bootstrap/dist/js/bootstrap.js');
app.import('bower_components/bootstrap/dist/css/bootstrap.css');
app.import('bower_components/moment/moment.js');
app.import('bower_components/moment-timezone/builds/moment-timezone-with-data-2010-2020.js');
app.import('bower_components/bootstrap-markdown/js/bootstrap-markdown.js');
app.import('bower_components/bootstrap-markdown/css/bootstrap-markdown.min.css');
app.import('bower_components/marked/lib/marked.js');
app.import('bower_components/html.sortable/dist/html.sortable.min.js');
app.import('bower_components/pace/pace.js');
app.import('bower_components/pace/themes/purple/pace-theme-center-simple.css');
app.import('bower_components/ember-uploader/dist/ember-uploader.named-amd.js');
app.import('vendor/fontello/css/fontello.css');

var mergeTrees = require('broccoli-merge-trees');
var pickFiles = require('broccoli-static-compiler');
var bootstrapFonts = pickFiles('bower_components/bootstrap/dist/fonts', {
  srcDir: '/',
  files: ['**/*'],
  destDir: '/fonts'
});
var customFonts = pickFiles('vendor/fontello/font', {
  srcDir: '/',
  files: ['**/*'],
  destDir: '/fonts'
});

module.exports = mergeTrees([app.toTree(), bootstrapFonts, customFonts]);
