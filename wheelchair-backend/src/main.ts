import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as compression from 'compression';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') || 3000;
  const nodeEnv = configService.get<string>('app.nodeEnv');
  const frontendUrl = configService.get<string>('app.cors.frontendUrl');
  const adminUrl = configService.get<string>('app.cors.adminUrl');
  const isProduction = nodeEnv === 'production';

  // ── Ensure uploads directory exists ──────────────────────
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    logger.log(`Created uploads directory: ${uploadsDir}`);
  }

  // ── Production middleware ─────────────────────────────────
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));
  app.use(compression());

  // ── Global prefix ─────────────────────────────────────────
  app.setGlobalPrefix('api/v1');

  // ── CORS ──────────────────────────────────────────────────
  app.enableCors({
    origin: [
      frontendUrl,
      adminUrl,
      ...(!isProduction ? ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'] : []),
    ].filter(Boolean),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // ── Global validation pipe ────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: isProduction,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ── Swagger API docs ──────────────────────────────────────
  const swaggerEnabled = configService.get<boolean>('app.swagger.enabled');
  if (swaggerEnabled) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('wheelchair.uz API')
      .setDescription(
        'wheelchair.uz backend API. \n\n' +
        '**Authentication:** Use `/api/v1/auth/login` to get JWT token, then click the Authorize button.',
      )
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'access-token',
      )
      .addTag('Auth', 'Authentication endpoints')
      .addTag('Products', 'Product management')
      .addTag('Categories', 'Category management')
      .addTag('Inquiries', 'Customer inquiry management')
      .addTag('Media', 'File upload management')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
      },
    });

    logger.log(`Swagger docs: http://localhost:${port}/api/docs`);
  }

  // ── Start server ──────────────────────────────────────────
  await app.listen(port, '0.0.0.0');

  logger.log(`🚀 Server running on http://localhost:${port}`);
  logger.log(`📦 Environment: ${nodeEnv}`);
  logger.log(`🌐 CORS allowed: ${frontendUrl}, ${adminUrl}`);
  if (swaggerEnabled) {
    logger.log(`📖 API Docs: http://localhost:${port}/api/docs`);
  }
}

bootstrap().catch((err) => {
  console.error('Bootstrap failed:', err);
  process.exit(1);
});
