var VALID_DEPLOY_TARGETS = [
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

  if (deployTarget === 'staging') {
    ENV.build.environment = "staging";
    ENV.redis.host = "localhost"
    ENV.s3.accessKeyId = process.env.aws_access_key_id;
    ENV.s3.secretAccessKey = process.env.aws_secret_access_key;
    ENV.s3.bucket = "mcac-staging";
    ENV.s3.region = "us-east-1";

    ENV["ssh-tunnel"] = {
      username: "deploy",
      host: "staging.mcac.church"
    }

    ENV.plugins = ["build", "revision-data", "s3", "ssh-tunnel", "redis"];
  }

  return ENV;
}
