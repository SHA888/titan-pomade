import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { EmailVerificationService } from './email-verification.service';
import {
  SignUpDto,
  SignInDto,
  AuthResponseDto,
} from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailVerificationService: EmailVerificationService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ message: string }> {
    const { email, password, name } = signUpDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new UnauthorizedException('Email already in use');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'USER', // Default role
        isEmailVerified: false, // Email not verified yet
      },
    });

    try {
      // Generate and send verification email
      const token =
        await this.emailVerificationService.createEmailVerificationToken(
          user.id,
        );
      await this.emailVerificationService.sendVerificationEmail(
        user.email,
        token,
      );

      return {
        message:
          'Registration successful. Please check your email to verify your account.',
      };
    } catch {
      // If sending email fails, delete the user to prevent unverified accounts
      await this.prisma.user.delete({ where: { id: user.id } });
      throw new Error('Failed to send verification email. Please try again.');
    }
  }

  async signIn(signInDto: SignInDto): Promise<AuthResponseDto> {
    const { email, password } = signInDto;

    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    // Check if user exists and password is correct
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      throw new UnauthorizedException(
        'Please verify your email before signing in',
      );
    }

    // Generate tokens
    return this.generateTokens(user.id, user.email, user.role);
  }

  async refreshTokens(
    userId: string,
    email: string,
    role: string,
  ): Promise<AuthResponseDto> {
    return this.generateTokens(userId, email, role);
  }

  async getMe(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  private async generateTokens(
    userId: string,
    email: string,
    role: string,
  ): Promise<AuthResponseDto> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role,
        },
        {
          secret: this.configService.get('jwt.secret'),
          expiresIn: this.configService.get('jwt.accessTokenExpiresIn'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role,
        },
        {
          secret: this.configService.get('jwt.secret'),
          expiresIn: this.configService.get('jwt.refreshTokenExpiresIn'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
