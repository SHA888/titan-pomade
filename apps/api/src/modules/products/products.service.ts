import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CrudService } from '../../common/crud/crud.service';
import { Product, Prisma } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService extends CrudService<
  Product,
  CreateProductDto,
  UpdateProductDto
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'product');
  }

  async findByCategory(category: string) {
    return this.prisma.product.findMany({
      where: { category },
    });
  }

  async searchByName(name: string) {
    return this.prisma.product.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
    });
  }

  async updateStock(productId: string, quantity: number) {
    return this.prisma.product.update({
      where: { id: productId },
      data: { stock: quantity },
    });
  }
}
