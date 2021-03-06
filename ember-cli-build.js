/* eslint-env node */
/* global require, module */
const EmberApp = require("ember-cli/lib/broccoli/ember-app");

module.exports = function(defaults) {
  var env = EmberApp.env() || "development";
  var isProductionLikeBuild = ["production", "staging"].indexOf(env) > -1;
  var fingerprintOptions = {
    enabled: true,
    extensions: ["js", "css", "png", "jpg", "gif"]
  };

  switch (env) {
    case "development":
      break;
    case "staging":
      fingerprintOptions.prepend = "https://s3.amazonaws.com/mcac-staging/app/";
      break;
    case "production":
      fingerprintOptions.prepend = "https://s3.amazonaws.com/mcac/app/";
      break;
  }

  var app = new EmberApp(defaults, {
    fingerprint: fingerprintOptions,
    babel: {
      includePolyfill: true,
    },
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
    },
    dotEnv: {
      clientAllowedKeys: [
        "CLOUDINARY_CLOUD_NAME",
        "DOMAIN"
      ],
      path: {
        development: ".env",
        test: ".env.test",
        production: ".env.production"
      }
    }
  });

  app.import("bower_components/tether/dist/js/tether.js");
  app.import("bower_components/tether/dist/css/tether.css");
  app.import("bower_components/bootstrap/dist/js/bootstrap.js");
  app.import("bower_components/bootstrap/dist/css/bootstrap.css");
  app.import("bower_components/moment/moment.js");
  app.import("bower_components/moment-timezone/builds/moment-timezone-with-data-2010-2020.js");
  app.import("bower_components/bootstrap-markdown/js/bootstrap-markdown.js");
  app.import("bower_components/bootstrap-markdown/css/bootstrap-markdown.min.css");
  app.import("bower_components/pace/pace.js");
  app.import("bower_components/pace/themes/purple/pace-theme-center-simple.css");
  app.import("bower_components/ember-uploader/dist/ember-uploader.named-amd.js");
  app.import("vendor/fontello/css/fontello.css");

  var mergeTrees = require("broccoli-merge-trees");
  var pickFiles = require("broccoli-static-compiler");
  var customFonts = pickFiles("vendor/fontello/font", {
    srcDir: "/",
    files: ["**/*"],
    destDir: "/font"
  });

  return mergeTrees([app.toTree(), customFonts]);
};
