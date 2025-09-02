import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '@prisma/client';

class OrderItemDto {
  @ApiProperty({ description: 'Product ID', example: 'prod_123' })
  @IsString()
  productId!: string;

  @ApiProperty({ description: 'Quantity', example: 2 })
  @IsNumber()
  quantity!: number;

  @ApiProperty({ description: 'Price per item', example: 29.99 })
  @IsNumber()
  price!: number;
}

export class CreateOrderDto {
  @ApiProperty({ description: 'User ID', example: 'user_123' })
  @IsString()
  userId!: string;

  @ApiProperty({ description: 'Order items', type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];

  @ApiProperty({ description: 'Total order amount', example: 59.98 })
  @IsNumber()
  total!: number;

  @ApiProperty({
    description: 'Order status',
    enum: OrderStatus,
    example: OrderStatus.PENDING,
    required: false,
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiProperty({
    description: 'Shipping address',
    example: '123 Main St, City, Country',
    required: false,
  })
  @IsOptional()
  @IsString()
  shippingAddress?: string;

  @ApiProperty({
    description: 'Payment method',
    example: 'Credit Card',
    required: false,
  })
  @IsOptional()
  @IsString()
  paymentMethod?: string;
}
