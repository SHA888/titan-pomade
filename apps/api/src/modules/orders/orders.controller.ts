import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CrudController } from '../../common/crud/crud.controller';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderStatus } from '@prisma/client';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController extends CrudController<
  Order,
  CreateOrderDto,
  UpdateOrderDto
> {
  constructor(private readonly ordersService: OrdersService) {
    super(ordersService);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get orders by user ID' })
  @ApiQuery({ name: 'userId', description: 'User ID', type: String })
  @ApiOkResponse({ description: 'Returns orders for the specified user.' })
  async findByUser(@Query('userId') userId: string) {
    return await this.ordersService.findByUser(userId);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get orders by status' })
  @ApiQuery({ name: 'status', description: 'Order status', type: String })
  @ApiOkResponse({ description: 'Returns orders with the specified status.' })
  async findByStatus(@Query('status') status: string) {
    // Validate that the status is a valid OrderStatus
    if (!Object.values(OrderStatus).includes(status as OrderStatus)) {
      throw new Error('Invalid order status');
    }

    return await this.ordersService.findByStatus(status as OrderStatus);
  }
}
