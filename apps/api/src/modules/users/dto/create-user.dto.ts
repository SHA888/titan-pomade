import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: 'User password', example: 'password123' })
  @IsString()
  password!: string;

  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'User role',
    enum: Role,
    example: Role.USER,
    required: false,
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiProperty({
    description: 'Email verification status',
    example: false,
    required: false,
  })
  @IsOptional()
  isEmailVerified?: boolean;
}
