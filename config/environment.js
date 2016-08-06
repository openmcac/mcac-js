/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'mcac',
    environment: environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },
    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME
    },
    marked: {
      js: false,
      highlightjs: false
    },
    resizeServiceDefaults: {
      debounceTimeout: 100,
      heightSensitive: true,
      widthSensitive: false
    },
    "simple-auth": {
      authorizer: 'authorizer:mcac'
    },
    moment: {
      includeTimezone: "all"
    },
    metricsAdapters: [{
      name: "GoogleAnalytics",
      environments: ["production"],
      config: {
        id: "UA-61127901-1"
      }
    }]
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV['simple-auth'] = {
      store: 'simple-auth-session-store:ephemeral'
    };
  }

  return ENV;
};
