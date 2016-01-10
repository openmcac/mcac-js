var VALID_DEPLOY_TARGETS = [ //update these to match what you call your deployment targets
  'development',
  'staging',
  'production'
];

module.exports = function(deployTarget) {
  var ENV = {
    build: {},
    redis: {
      allowOverwrite: true,
      keyPrefix: 'basechurch:index'
    },
    s3: {
      prefix: 'app'
    }
  };

  if (VALID_DEPLOY_TARGETS.indexOf(deployTarget) === -1) {
    throw new Error('Invalid deployTarget ' + deployTarget);
  }

  if (deployTarget === 'development') {
    ENV.build.environment = 'development';
    ENV.redis.url = process.env.REDIS_URL || 'redis://0.0.0.0:6379/';
    ENV.plugins = ['build', 'redis']; // only care about deploying index.html into redis in dev
  }

  if (deployTarget === 'staging') {
    ENV.build.environment = deployTarget;
    ENV.redis.url = "redis://staging.mcac.church:6379/"
    ENV.s3.accessKeyId = process.env.aws_access_key_id;
    ENV.s3.secretAccessKey = process.env.aws_secret_access_key;
    ENV.s3.bucket = "mcac-staging";
    ENV.s3.region = "us-east-1";
    ENV.plugins = ["build", "revision-data", "s3", "redis"];
  }

  return ENV;

  /* Note: a synchronous return is show above, but ember-cli-deploy
   * does support returning a promise, in case you need to get any of
   * your configuration asynchronously. e.g.
   *
   *    var Promise = require('ember-cli/lib/ext/promise');
   *    return new Promise(function(resolve, reject){
   *      var exec = require('child_process').exec;
   *      var command = 'heroku config:get REDISTOGO_URL --app my-app-' + deployTarget;
   *      exec(command, function (error, stdout, stderr) {
   *        ENV.redis.url = stdout.replace(/\n/, '').replace(/\/\/redistogo:/, '//:');
   *        if (error) {
   *          reject(error);
   *        } else {
   *          resolve(ENV);
   *        }
   *      });
   *    });
   *
   */
}
