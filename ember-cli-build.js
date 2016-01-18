/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var env = EmberApp.env() || "development";
  var isProductionLikeBuild = ['production', 'staging'].indexOf(env) > -1;
  var fingerprintOptions = {
    enabled: true,
    extensions: ['js', 'css', 'png', 'jpg', 'gif']
  };

  switch (env) {
    case "development":
      break;
    case "staging":
      fingerprintOptions.prepend = "https://s3.amazonaws.com/mcac-staging/app/";
      break;
  }

  var app = new EmberApp(defaults, {
    fingerprint: fingerprintOptions,
    emberCLIDeploy: {
      configFile: "config/deploy.js",
      shouldActivate: true
    },
    sourcemaps: {
      enabled: !isProductionLikeBuild
    },
    minifyCSS: {
      enabled: isProductionLikeBuild
    },
    minifyJS: {
      enabled: isProductionLikeBuild
    }
  });

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
    destDir: '/font'
  });

  return mergeTrees([app.toTree(), bootstrapFonts, customFonts]);
};
