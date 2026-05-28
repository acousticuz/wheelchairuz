import { registerAs } from '@nestjs/config';

const isProduction = process.env.NODE_ENV === 'production';

function requireProductionValue(name: string, fallback?: string) {
  const value = process.env[name] || fallback;
  if (isProduction && (!process.env[name] || process.env[name] === fallback)) {
    throw new Error(`Missing secure production environment value: ${name}`);
  }
  return value;
}

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  database: {
    type: (process.env.DB_TYPE || 'mysql') as 'mysql' | 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || 'wheelchair_db',
    synchronize: !isProduction && process.env.DB_SYNC === 'true',
    logging: process.env.DB_LOGGING === 'true',
    sslEnabled: process.env.DB_SSL === 'true',
    sslRejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
  },

  jwt: {
    secret: requireProductionValue('JWT_SECRET', 'local-development-jwt-secret-change-me'),
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@wheelchair.uz',
    password: requireProductionValue('ADMIN_PASSWORD', 'admin123'),
    name: process.env.ADMIN_NAME || 'Admin',
  },

  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    adminChatId: process.env.TELEGRAM_ADMIN_CHAT_ID,
  },

  upload: {
    dir: process.env.UPLOAD_DIR || './uploads',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 5242880,
  },

  cors: {
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    adminUrl: process.env.ADMIN_URL || 'http://localhost:5173',
  },

  swagger: {
    enabled: process.env.SWAGGER_ENABLED
      ? process.env.SWAGGER_ENABLED !== 'false'
      : !isProduction,
  },
}));
