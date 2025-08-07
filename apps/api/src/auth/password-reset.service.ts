import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomBytes, createHash } from 'crypto';
import { addHours } from 'date-fns';

@Injectable()
export class PasswordResetService {
  private readonly RESET_TOKEN_EXPIRES_IN_HOURS = 1; // Token expires in 1 hour

  constructor(private prisma: PrismaService) {}

  async createPasswordResetToken(email: string): Promise<string> {
    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // For security reasons, we don't reveal if the email exists or not
      return;
    }

    // Generate a secure random token
    const token = randomBytes(32).toString('hex');
    const hashedToken = this.hashToken(token);

    // Set expiration time
    const expiresAt = addHours(new Date(), this.RESET_TOKEN_EXPIRES_IN_HOURS);

    // Delete any existing tokens for this user
    await this.prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    // Create new reset token
    await this.prisma.passwordResetToken.create({
      data: {
        token: hashedToken,
        userId: user.id,
        expiresAt,
      },
    });

    // Return the unhashed token (will be sent via email)
    return token;
  }

  async validatePasswordResetToken(token: string): Promise<{ userId: string }> {
    const hashedToken = this.hashToken(token);
    const now = new Date();

    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { token: hashedToken },
      include: { user: true },
    });

    if (!resetToken) {
      throw new UnauthorizedException(
        'Invalid or expired password reset token',
      );
    }

    if (resetToken.expiresAt < now) {
      // Clean up expired token
      await this.prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
      });
      throw new UnauthorizedException('Password reset token has expired');
    }

    return { userId: resetToken.userId };
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const { userId } = await this.validatePasswordResetToken(token);

    // Update user's password
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: newPassword },
    });

    // Delete the used token
    await this.prisma.passwordResetToken.deleteMany({
      where: { userId },
    });
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
