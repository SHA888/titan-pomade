import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CrudController } from '../../common/crud/crud.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from '@prisma/client';

@ApiTags('Products')
@Controller('products')
export class ProductsController extends CrudController<
  Product,
  CreateProductDto,
  UpdateProductDto
> {
  constructor(private readonly productsService: ProductsService) {
    super(productsService);
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get products by category' })
  @ApiQuery({ name: 'category', description: 'Product category', type: String })
  @ApiOkResponse({ description: 'Returns products in the specified category.' })
  async findByCategory(@Query('category') category: string) {
    return await this.productsService.findByCategory(category);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search products by name' })
  @ApiQuery({ name: 'q', description: 'Search query', type: String })
  @ApiOkResponse({ description: 'Returns products matching the search query.' })
  async searchByName(@Query('q') query: string) {
    return await this.productsService.searchByName(query);
  }
}
