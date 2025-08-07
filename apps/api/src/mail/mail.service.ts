import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ISendMailOptions } from '@nestjs-modules/mailer/dist/interfaces/send-mail-options.interface';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly frontendUrl: string;
  private readonly appName: string;

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
    this.frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    this.appName = this.configService.get<string>('APP_NAME') || 'Titan Pomade';
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const resetUrl = `${this.frontendUrl}/reset-password?token=${encodeURIComponent(resetToken)}`;

    const mailOptions: ISendMailOptions = {
      to: email,
      subject: `${this.appName} - Password Reset Request`,
      template: './password-reset',
      context: {
        appName: this.appName,
        resetUrl,
        year: new Date().getFullYear(),
      },
    };

    try {
      await this.mailerService.sendMail(mailOptions);
      this.logger.log(`Password reset email sent to ${email}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.stack : String(error);
      this.logger.error(
        `Failed to send password reset email to ${email}`,
        errorMessage,
      );
      throw new Error('Failed to send password reset email');
    }
  }
}
