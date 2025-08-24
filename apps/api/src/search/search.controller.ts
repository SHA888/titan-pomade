import {
  Controller,
  Get,
  Query,
  Post,
  Headers,
  ForbiddenException,
} from '@nestjs/common';
import { SearchService } from './search.service';
import { ConfigService } from '@nestjs/config';

@Controller('search')
export class SearchController {
  constructor(
    private readonly search: SearchService,
    private readonly config: ConfigService,
  ) {}

  @Get()
  async searchProducts(
    @Query('q') q = '',
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('sort')
    sort?: 'price:asc' | 'price:desc' | 'createdAt:asc' | 'createdAt:desc',
  ) {
    return this.search.search({
      q,
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      category,
      minPrice: typeof minPrice === 'string' ? Number(minPrice) : undefined,
      maxPrice: typeof maxPrice === 'string' ? Number(maxPrice) : undefined,
      sort,
    });
  }

  @Get('suggest')
  async suggest(@Query('q') q = '', @Query('limit') limit = '5') {
    const suggestions = await this.search.suggest(q, Number(limit) || 5);
    return { suggestions };
  }

  // Reindex endpoint - require token in production via X-Reindex-Token header
  @Post('reindex')
  async reindex(@Headers('x-reindex-token') token?: string) {
    const nodeEnv = this.config.get<string>('app.nodeEnv');
    const required =
      this.config.get<string>('app.reindexToken') || process.env.REINDEX_TOKEN;
    const isProd = nodeEnv === 'production';

    if (isProd) {
      if (!required || token !== required) {
        throw new ForbiddenException('Invalid reindex token');
      }
    }

    return this.search.reindexAll();
  }
}
