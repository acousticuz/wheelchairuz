import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { existsSync } from 'fs';

// Optionally serve the built React SPA from the same Node process.
// Copy the frontend `dist/` into `<backend>/client` (or set CLIENT_DIR).
const clientDir = process.env.CLIENT_DIR || join(process.cwd(), 'client');
const serveSpa = existsSync(join(clientDir, 'index.html'));

import appConfig from './config/app.config';
import { DatabaseSeeder } from './config/database.seeder';
import { DatabaseIndexesService } from './config/database-indexes.service';

import { User } from './modules/users/user.entity';
import { Category } from './modules/categories/category.entity';
import { Product } from './modules/products/product.entity';
import { Inquiry } from './modules/inquiries/inquiry.entity';
import { Media } from './modules/media/media.entity';
import { ContentPage } from './modules/content/content.entity';
import { Language } from './modules/languages/language.entity';
import { HomeSection } from './modules/home-sections/home-section.entity';

import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';
import { InquiriesModule } from './modules/inquiries/inquiries.module';
import { TelegramModule } from './modules/telegram/telegram.module';
import { MediaModule } from './modules/media/media.module';
import { ContentModule } from './modules/content/content.module';
import { LanguagesModule } from './modules/languages/languages.module';
import { HealthModule } from './modules/health/health.module';
import { HomeSectionsModule } from './modules/home-sections/home-sections.module';

@Module({
  imports: [
    // ── Config ──────────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: '.env',
    }),

    // ── Rate limiting ────────────────────────────────────
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 10,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 50,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 200,
      },
    ]),

    // ── Database ─────────────────────────────────────────
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: cfg.get<'mysql' | 'postgres'>('app.database.type') ?? 'mysql',
        host: cfg.get('app.database.host'),
        port: cfg.get<number>('app.database.port'),
        username: cfg.get('app.database.username'),
        password: cfg.get('app.database.password'),
        database: cfg.get('app.database.database'),
        charset: 'utf8mb4',
        entities: [User, Category, Product, Inquiry, Media, ContentPage, Language, HomeSection],
        synchronize: cfg.get<boolean>('app.database.synchronize'),
        logging: cfg.get<boolean>('app.database.logging'),
        ssl: cfg.get<boolean>('app.database.sslEnabled')
          ? {
              rejectUnauthorized: cfg.get<boolean>(
                'app.database.sslRejectUnauthorized',
              ),
            }
          : false,
        autoLoadEntities: true,
      } as TypeOrmModuleOptions),
    }),

    // ── Static file serving for uploads ──────────────────
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: {
        maxAge: '30d',
        immutable: true,
      },
    }),

    // ── Serve the built React SPA (optional) ──────────────
    ...(serveSpa
      ? [
          ServeStaticModule.forRoot({
            rootPath: clientDir,
            exclude: ['/api/{*path}', '/uploads/{*path}'],
          }),
        ]
      : []),

    // ── Feature modules ───────────────────────────────────
    TelegramModule,
    UsersModule,
    AuthModule,
    CategoriesModule,
    ProductsModule,
    InquiriesModule,
    MediaModule,
    ContentModule,
    LanguagesModule,
    HealthModule,
    HomeSectionsModule,
  ],
  providers: [DatabaseSeeder, DatabaseIndexesService],
})
export class AppModule {}
