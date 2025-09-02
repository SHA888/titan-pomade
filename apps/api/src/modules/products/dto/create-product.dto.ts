import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsDecimal,
  Min,
  Max,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'Product name', example: 'Premium Pomade' })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'Product description',
    example: 'High-quality hair styling product',
  })
  @IsString()
  description!: string;

  @ApiProperty({ description: 'Product price', example: 29.99, type: 'number' })
  @IsDecimal()
  @Min(0)
  price!: number;

  @ApiProperty({ description: 'Product stock quantity', example: 100 })
  @IsNumber()
  @Min(0)
  stock!: number;

  @ApiProperty({
    description: 'Product image URL',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ description: 'Product category', example: 'Hair Care' })
  @IsString()
  category!: string;

  @ApiProperty({
    description: 'Whether the product is active',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
