module.exports = {
  apps : [{
    name: 'aut',
    script: 'aut/index.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: '--mongo=127.0.0.1/at --port=7008 --debugout',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '2G',
    time: true,
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
