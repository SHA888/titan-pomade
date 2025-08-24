import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import type { Prisma, Product } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SearchService, ProductDocument } from './search.service';

@Injectable()
export class SearchSyncService implements OnModuleInit {
  private readonly logger = new Logger(SearchSyncService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly search: SearchService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.search.ensureIndexes();

    this.prisma.$use(async (params: Prisma.MiddlewareParams, next) => {
      const result: unknown = await next(params);

      // Only sync Product model changes
      if (params.model === 'Product') {
        try {
          switch (params.action) {
            case 'create':
            case 'update':
            case 'upsert': {
              const p = result as Product; // created/updated product row
              const doc: ProductDocument = {
                id: p.id,
                name: p.name,
                description: p.description,
                category: p.category,
                price: Number(p.price),
                imageUrl: p.imageUrl,
                createdAt: p.createdAt.toISOString(),
                updatedAt: p.updatedAt.toISOString(),
              };
              await this.search.upsertDocuments([doc]);
              break;
            }
            case 'delete': {
              let id: string | undefined;
              if (
                params.args &&
                typeof params.args === 'object' &&
                'where' in (params.args as Record<string, unknown>)
              ) {
                const where = (params.args as { where?: { id?: string } })
                  .where;
                id = where?.id;
              }
              if (
                !id &&
                result &&
                typeof result === 'object' &&
                'id' in result
              ) {
                id = (result as { id?: string }).id;
              }
              if (id) await this.search.deleteDocuments([id]);
              break;
            }
            case 'deleteMany': {
              // No-op: not common; rely on reindex if needed
              break;
            }
            default:
              break;
          }
        } catch (e) {
          this.logger.warn(`Search sync skipped: ${(e as Error).message}`);
        }
      }

      return result;
    });

    this.logger.log('Prisma-MeiliSearch sync middleware registered');
  }
}
