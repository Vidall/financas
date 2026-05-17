module.exports = {
  apps: [
    {
      name: 'financas-backend',
      cwd: '/var/www/financas/backend',
      script: 'node',
      args: 'dist/main.js',
      env: {
        NODE_ENV: 'production',
      },
      watch: false,
      instances: 1,
      autorestart: true,
    },
    {
      name: 'financas-frontend',
      cwd: '/var/www/financas/frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
      },
      watch: false,
      instances: 1,
      autorestart: true,
    },
  ],
};
