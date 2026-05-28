module.exports = {
  apps: [
    {
      // ── Backend API ─────────────────────────────────────
      name: 'wheelchair-api',
      script: 'dist/main.js',
      cwd: '/var/www/wheelchair-backend',
      instances: 'max',          // CPU core soni bo'yicha
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: '/var/log/wheelchair/api-error.log',
      out_file: '/var/log/wheelchair/api-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      restart_delay: 3000,
      max_restarts: 10,
      min_uptime: '10s',
      // Graceful shutdown
      kill_timeout: 5000,
      listen_timeout: 10000,
    },
  ],
};
