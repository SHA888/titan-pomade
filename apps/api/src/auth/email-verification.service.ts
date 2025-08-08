import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { randomBytes, createHash } from 'crypto';
import { addHours } from 'date-fns';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';

// Extend the PrismaClient to include the new model
type PrismaClientWithEmailVerification = PrismaClient & {
  emailVerificationToken: {
    deleteMany: (args: {
      where: { userId: string };
    }) => Promise<{ count: number }>;
    create: (args: {
      data: Prisma.EmailVerificationTokenCreateInput;
    }) => Promise<{ id: string }>;
    findUnique: (args: {
      where: { token: string };
    }) => Promise<{ id: string; userId: string; expiresAt: Date } | null>;
    delete: (args: { where: { id: string } }) => Promise<{ id: string }>;
  };
};

@Injectable()
export class EmailVerificationService {
  private readonly VERIFICATION_TOKEN_EXPIRES_IN_HOURS = 24; // Token expires in 24 hours

  private prisma: PrismaClientWithEmailVerification;

  constructor(
    prismaService: PrismaService,
    private mailService: MailService,
    private configService: ConfigService,
  ) {
    this.prisma = prismaService as unknown as PrismaClientWithEmailVerification;
  }

  async createEmailVerificationToken(userId: string): Promise<string> {
    // Generate a secure random token
    const token = randomBytes(32).toString('hex');
    const hashedToken = this.hashToken(token);

    // Set expiration time
    const expiresAt = addHours(
      new Date(),
      this.VERIFICATION_TOKEN_EXPIRES_IN_HOURS,
    );

    // Delete any existing tokens for this user
    await this.prisma.emailVerificationToken.deleteMany({
      where: { userId },
    });

    // Create new verification token
    await this.prisma.emailVerificationToken.create({
      data: {
        token: hashedToken,
        expiresAt,
        user: { connect: { id: userId } },
      } as Prisma.EmailVerificationTokenCreateInput,
    });

    // Return the unhashed token (will be sent via email)
    return token;
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const frontendUrl = this.configService.get<string>('frontend.url');
    if (!frontendUrl) {
      throw new Error('Frontend URL is not configured');
    }

    const verificationUrl = `${frontendUrl}/verify-email?token=${encodeURIComponent(token)}`;
    const appName =
      this.configService.get<string>('APP_NAME') || 'Titan Pomade';

    await this.mailService.sendEmail(
      email,
      `${appName} - Verify Your Email`,
      'email-verification',
      {
        appName,
        verificationUrl,
        token,
      },
    );
  }

  async verifyEmailToken(token: string): Promise<{ userId: string }> {
    // Hash the token to match what's in the database
    const hashedToken = this.hashToken(token);
    const now = new Date();

    // Find the token in the database
    const verificationToken =
      await this.prisma.emailVerificationToken.findUnique({
        where: { token: hashedToken },
      });

    // Check if token exists and is not expired
    if (!verificationToken || verificationToken.expiresAt < now) {
      throw new UnauthorizedException('Invalid or expired verification token');
    }

    // Mark user as verified
    await this.prisma.user.update({
      where: { id: verificationToken.userId },
      data: { isEmailVerified: true } as Prisma.UserUpdateInput,
    });

    // Delete the used token
    await this.prisma.emailVerificationToken.delete({
      where: { id: verificationToken.id },
    });

    return { userId: verificationToken.userId };
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
