import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CrudService } from '../../common/crud/crud.service';
import { Order, Prisma, OrderStatus } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService extends CrudService<
  Order,
  CreateOrderDto,
  UpdateOrderDto
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'order');
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // Calculate total if not provided
    const total =
      createOrderDto.total ||
      createOrderDto.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

    return this.prisma.order.create({
      data: {
        userId: createOrderDto.userId,
        total,
        status: createOrderDto.status,
        shippingAddress: createOrderDto.shippingAddress,
        paymentMethod: createOrderDto.paymentMethod,
        items: {
          create: createOrderDto.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async findByStatus(status: OrderStatus) {
    return this.prisma.order.findMany({
      where: { status },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }
}
