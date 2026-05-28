import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';

interface IndexSpec {
  name: string;
  table: string;
  columns: Array<{ col: string; desc?: boolean }>;
}

const INDEXES: IndexSpec[] = [
  {
    name: 'idx_products_active_created',
    table: 'products',
    columns: [{ col: 'isActive' }, { col: 'createdAt', desc: true }],
  },
  {
    name: 'idx_products_active_featured',
    table: 'products',
    columns: [
      { col: 'isActive' },
      { col: 'isFeatured' },
      { col: 'sortOrder' },
      { col: 'createdAt', desc: true },
    ],
  },
  {
    name: 'idx_products_category_active',
    table: 'products',
    columns: [{ col: 'categoryId' }, { col: 'isActive' }],
  },
  { name: 'idx_products_sku', table: 'products', columns: [{ col: 'sku' }] },
  { name: 'idx_products_price', table: 'products', columns: [{ col: 'price' }] },
  {
    name: 'idx_categories_active_sort',
    table: 'categories',
    columns: [{ col: 'isActive' }, { col: 'sortOrder' }, { col: 'createdAt' }],
  },
  {
    name: 'idx_inquiries_status_created',
    table: 'inquiries',
    columns: [{ col: 'status' }, { col: 'createdAt', desc: true }],
  },
  {
    name: 'idx_media_created',
    table: 'media',
    columns: [{ col: 'createdAt', desc: true }],
  },
];

@Injectable()
export class DatabaseIndexesService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseIndexesService.name);

  constructor(private readonly dataSource: DataSource) {}

  async onApplicationBootstrap() {
    if (!this.dataSource.isInitialized) return;

    const isMysql = this.dataSource.options.type === 'mysql';
    const q = isMysql ? '`' : '"';

    for (const idx of INDEXES) {
      const cols = idx.columns
        .map(({ col, desc }) => `${q}${col}${q}${desc ? ' DESC' : ''}`)
        .join(', ');

      try {
        if (isMysql) {
          const exists = await this.dataSource.query(
            'SELECT 1 FROM information_schema.statistics WHERE table_schema = DATABASE() AND table_name = ? AND index_name = ? LIMIT 1',
            [idx.table, idx.name],
          );
          if (exists.length > 0) continue;
          await this.dataSource.query(
            `CREATE INDEX ${q}${idx.name}${q} ON ${q}${idx.table}${q} (${cols})`,
          );
        } else {
          await this.dataSource.query(
            `CREATE INDEX IF NOT EXISTS ${idx.name} ON ${idx.table} (${cols})`,
          );
        }
      } catch (error) {
        const reason = error instanceof Error ? error.message : String(error);
        this.logger.warn(`Could not create index ${idx.name}: ${reason}`);
      }
    }
  }
}
