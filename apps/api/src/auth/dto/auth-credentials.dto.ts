import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @IsEmail()
  email!: string;

  @MinLength(6)
  password!: string;

  @IsNotEmpty()
  name!: string;
}

export class SignInDto {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  password!: string;
}

export class AuthResponseDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty()
  refreshToken!: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  @ApiProperty({ example: 'user@example.com' })
  email!: string;
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  token!: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({ minLength: 8 })
  newPassword!: string;
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  currentPassword!: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({ minLength: 8 })
  newPassword!: string;
}

export class VerifyEmailDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  token!: string;
}
