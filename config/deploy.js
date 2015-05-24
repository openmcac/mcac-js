/* jshint node: true */

module.exports = {
  staging: {
    store: {
      type: 'redis',
      host: 'staging.mcac.church',
      port: 6379
    },
    assets: {
      gzip: false,
      type: 'rsync',
      dest: 'deploy@staging.mcac.church:~/apps/mcac-js',
      ssh: true,
      port: 22,
      privateKey: '~/.ssh/id_rsa',
      args: ['-av']
    }
  },
  production: {
    store: {
      type: 'redis',
      host: 'mcac.church',
      port: 6379
    },
    assets: {
      gzip: false,
      type: 'rsync',
      dest: 'deploy@mcac.church:~/apps/mcac-js',
      ssh: true,
      port: 22,
      privateKey: '~/.ssh/id_rsa',
      args: ['-av']
    }
  }
};
