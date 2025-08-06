import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

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
  accessToken!: string;
  refreshToken!: string;
}
