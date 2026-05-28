import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { UsersService } from '../modules/users/users.service';
import { CategoriesService } from '../modules/categories/categories.service';
import { ProductsService } from '../modules/products/products.service';
import { ContentService } from '../modules/content/content.service';
import { LanguagesService } from '../modules/languages/languages.service';
import { HomeSectionsService } from '../modules/home-sections/home-sections.service';
import { DEFAULT_HOME_SECTIONS } from '../modules/home-sections/home-sections.defaults';

@Injectable()
export class DatabaseSeeder implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseSeeder.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly categoriesService: CategoriesService,
    private readonly productsService: ProductsService,
    private readonly contentService: ContentService,
    private readonly languagesService: LanguagesService,
    private readonly homeSectionsService: HomeSectionsService,
  ) {}

  async onApplicationBootstrap() {
    await this.seedAdmin();
    await this.seedCategories();
    await this.contentService.seedDefaultPages();
    await this.languagesService.seedDefaults();
    await this.homeSectionsService.seedDefaults(DEFAULT_HOME_SECTIONS);
    const seedProductsEnabled = this.configService.get<string>('SEED_PRODUCTS') === 'true';
    if (seedProductsEnabled) {
      await this.seedProducts();
    } else {
      this.logger.log('SEED_PRODUCTS is disabled; demo products were not seeded');
    }
    this.logger.log('✅ Database seeding complete');
  }

  // ── Admin User ──────────────────────────────────────────
  private async seedAdmin() {
    const email = this.configService.get('app.admin.email');
    const password = this.configService.get('app.admin.password');
    const name = this.configService.get('app.admin.name');

    const admin = await this.usersService.createAdmin({ email, password, name });
    this.logger.log(`Admin user: ${admin.email}`);
  }

  // ── Categories ──────────────────────────────────────────
  private async seedCategories() {
    const categories = [
      {
        slug: 'wheelchairs',
        icon: 'wheelchair_pickup',
        name: { uz: 'Nogironlar aravachalari', ru: 'Инвалидные коляски', en: 'Wheelchairs' },
        sortOrder: 1,
      },
      {
        slug: 'walkers',
        icon: 'blind',
        name: { uz: 'Yurgichlar', ru: 'Ходунки', en: 'Walkers' },
        sortOrder: 2,
      },
      {
        slug: 'canes',
        icon: 'nordic_walking',
        name: { uz: "Hassa va qo'ltiqtayoqlar", ru: 'Трости и костыли', en: 'Canes & Crutches' },
        sortOrder: 3,
      },
      {
        slug: 'support',
        icon: 'support',
        name: { uz: "Xizmat va Ta'mirlash", ru: 'Сервис и ремонт', en: 'Support & Service' },
        sortOrder: 4,
      },
    ];

    await this.categoriesService.seed(categories);
    this.logger.log(`Categories seeded: ${categories.length}`);
  }

  // ── Products ─────────────────────────────────────────────
  private async loadSeedProductsFromJson() {
    const sourcePath = resolve(process.cwd(), 'scripts', 'sayqal-products-seed.json');
    try {
      const raw = await readFile(sourcePath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed?.products)) {
        return parsed.products as Array<{
          slug: string;
          sku: string;
          category_slug?: string;
          name?: { uz: string; ru: string; en: string };
          excerpt?: { uz: string; ru: string; en: string };
          description?: { uz: string; ru: string; en: string };
          price?: number;
          showPrice?: boolean;
          mainImage?: string;
          images?: string[];
          specs?: Array<{ label_uz: string; label_ru: string; label_en: string; value: string }>;
          tags?: string[];
          badge?: string | null;
          rating?: number;
          reviewCount?: number;
          isActive?: boolean;
          isFeatured?: boolean;
          sortOrder?: number;
        }>;
      }
      this.logger.warn('Products list missing in sayqal-products-seed.json');
      return [];
    } catch (err) {
      this.logger.warn(`Could not read seed source file: ${sourcePath}`);
      this.logger.warn(String(err));
      return [];
    }
  }

  private async seedProducts() {
    const wheelchairsCat = await this.categoriesService.findBySlug('wheelchairs').catch(() => null);
    const walkersCat = await this.categoriesService.findBySlug('walkers').catch(() => null);
    const canesCat = await this.categoriesService.findBySlug('canes').catch(() => null);
    const categoryMap: Record<string, string | undefined> = {
      wheelchairs: wheelchairsCat?.id,
      walkers: walkersCat?.id,
      canes: canesCat?.id,
      'canes-crutches': canesCat?.id,
    };

    const sourceProducts = await this.loadSeedProductsFromJson();
    const products = sourceProducts.map((p, idx) => ({
      slug: p.slug,
      sku: p.sku,
      name: p.name || { uz: '', ru: '', en: '' },
      excerpt: p.excerpt || { uz: '', ru: '', en: '' },
      description: p.description || { uz: '', ru: '', en: '' },
      price: p.price || 0,
      showPrice: p.showPrice ?? false,
      mainImage: p.mainImage || '',
      images: p.images || [],
      specs: p.specs || [],
      tags: p.tags || [],
      badge: p.badge || null,
      rating: p.rating || 0,
      reviewCount: p.reviewCount || 0,
      isActive: p.isActive ?? true,
      isFeatured: p.isFeatured ?? idx < 6,
      sortOrder: p.sortOrder ?? idx + 1,
      categoryId: categoryMap[p.category_slug],
    }));

    if (!products.length) {
      this.logger.warn('No products loaded for seeding');
      return;
    }

    await this.productsService.seed(products as any);
    this.logger.log(`Products seeded: ${products.length}`);
  }
}
