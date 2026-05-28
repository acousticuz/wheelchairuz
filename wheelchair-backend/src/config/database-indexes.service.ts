import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseIndexesService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseIndexesService.name);

  constructor(private readonly dataSource: DataSource) {}

  async onApplicationBootstrap() {
    if (!this.dataSource.isInitialized) return;

    const statements = [
      'CREATE INDEX IF NOT EXISTS idx_products_active_created ON products ("isActive", "createdAt" DESC)',
      'CREATE INDEX IF NOT EXISTS idx_products_active_featured ON products ("isActive", "isFeatured", "sortOrder", "createdAt" DESC)',
      'CREATE INDEX IF NOT EXISTS idx_products_category_active ON products ("categoryId", "isActive")',
      'CREATE INDEX IF NOT EXISTS idx_products_sku ON products (sku)',
      'CREATE INDEX IF NOT EXISTS idx_products_price ON products (price)',
      'CREATE INDEX IF NOT EXISTS idx_categories_active_sort ON categories ("isActive", "sortOrder", "createdAt")',
      'CREATE INDEX IF NOT EXISTS idx_inquiries_status_created ON inquiries (status, "createdAt" DESC)',
      'CREATE INDEX IF NOT EXISTS idx_media_created ON media ("createdAt" DESC)',
    ];

    for (const sql of statements) {
      try {
        await this.dataSource.query(sql);
      } catch (error) {
        const reason = error instanceof Error ? error.message : String(error);
        this.logger.warn(`Could not create index: ${reason}`);
      }
    }
  }
}
