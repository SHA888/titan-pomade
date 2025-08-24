import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

export type ProductDocument = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
};

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  private host: string;
  private apiKey?: string;

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.host =
      this.config.get<string>('MEILISEARCH_HOST') ||
      process.env.MEILISEARCH_HOST ||
      'http://localhost:7700';
    this.apiKey =
      this.config.get<string>('MEILISEARCH_MASTER_KEY') ||
      this.config.get<string>('MEILISEARCH_API_KEY') ||
      process.env.MEILISEARCH_MASTER_KEY ||
      process.env.MEILISEARCH_API_KEY ||
      undefined;
  }

  private async meili<T>(path: string, init?: RequestInit): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
      ...(init?.headers || {}),
    };
    const res = await fetch(`${this.host}${path}`, { ...init, headers });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(
        `Meili ${init?.method || 'GET'} ${path} failed (${res.status}): ${text}`,
      );
    }
    // 204 no content
    if (res.status === 204) return undefined as unknown as T;
    return (await res.json()) as T;
  }

  async ensureIndexes(): Promise<void> {
    // Check index
    const getIndex = await fetch(`${this.host}/indexes/products`, {
      headers: this.apiKey
        ? { Authorization: `Bearer ${this.apiKey}` }
        : undefined,
    });
    if (getIndex.status === 404) {
      await this.meili('/indexes', {
        method: 'POST',
        body: JSON.stringify({ uid: 'products', primaryKey: 'id' }),
      });
    }
    // Update settings
    await this.meili(`/indexes/products/settings`, {
      method: 'PATCH',
      body: JSON.stringify({
        searchableAttributes: ['name', 'description', 'category'],
        filterableAttributes: ['category', 'price'],
        sortableAttributes: ['price', 'createdAt'],
        typoTolerance: { enabled: true },
      }),
    });
  }

  async reindexAll(): Promise<{ count: number }> {
    await this.ensureIndexes();
    const products = await this.prisma.product.findMany();
    const docs: ProductDocument[] = products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      category: p.category,
      price: Number(p.price),
      imageUrl: p.imageUrl,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));

    if (docs.length === 0) return { count: 0 };

    const task = await this.meili<{ taskUid?: number }>(
      `/indexes/products/documents?primaryKey=id`,
      {
        method: 'POST',
        body: JSON.stringify(docs),
      },
    );
    this.logger.log(
      `Reindex task enqueued (${docs.length} docs)${task?.taskUid ? ` uid=${task.taskUid}` : ''}`,
    );
    return { count: docs.length };
  }

  async search(params: {
    q: string;
    page?: number;
    limit?: number;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: 'price:asc' | 'price:desc' | 'createdAt:asc' | 'createdAt:desc';
  }) {
    await this.ensureIndexes();
    const {
      q,
      page = 1,
      limit = 10,
      category,
      minPrice,
      maxPrice,
      sort,
    } = params;

    const offset = (page - 1) * limit;

    const filters: string[] = [];
    if (category) filters.push(`category = "${category}"`);
    if (typeof minPrice === 'number') filters.push(`price >= ${minPrice}`);
    if (typeof maxPrice === 'number') filters.push(`price <= ${maxPrice}`);

    const filter = filters.length ? filters.join(' AND ') : undefined;

    type MeiliSearchResponse = {
      hits: ProductDocument[];
      estimatedTotalHits: number;
    };
    const result = await this.meili<MeiliSearchResponse>(
      `/indexes/products/search`,
      {
        method: 'POST',
        body: JSON.stringify({
          q,
          offset,
          limit,
          filter,
          sort: sort ? [sort] : undefined,
        }),
      },
    );

    return {
      hits: result.hits,
      total: result.estimatedTotalHits,
      page,
      limit,
    };
  }

  async suggest(q: string, limit = 5): Promise<string[]> {
    await this.ensureIndexes();
    // Using search with attributesToCrop to save payload; Meili doesn't have a separate suggest API
    type MeiliSearchResponse = { hits: Array<{ name: string }> };
    const res = await this.meili<MeiliSearchResponse>(
      `/indexes/products/search`,
      {
        method: 'POST',
        body: JSON.stringify({ q, limit, attributesToRetrieve: ['name'] }),
      },
    );
    const names = Array.from(new Set(res.hits.map((h) => h.name))).slice(
      0,
      limit,
    );
    return names;
  }

  async upsertDocuments(docs: ProductDocument[]): Promise<void> {
    if (!docs.length) return;
    await this.meili(`/indexes/products/documents?primaryKey=id`, {
      method: 'POST',
      body: JSON.stringify(docs),
    });
  }

  async deleteDocuments(ids: string[]): Promise<void> {
    if (!ids.length) return;
    await this.meili(`/indexes/products/documents/delete-batch`, {
      method: 'POST',
      body: JSON.stringify(ids),
    });
  }
}
