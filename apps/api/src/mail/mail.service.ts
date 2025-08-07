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

  async sendEmail(
    to: string,
    subject: string,
    template: string,
    context: Record<string, unknown> = {},
  ): Promise<void> {
    const mailOptions: ISendMailOptions = {
      to,
      subject,
      template: `./${template}`,
      context: {
        appName: this.appName,
        year: new Date().getFullYear(),
        ...context,
      },
    };

    try {
      await this.mailerService.sendMail(mailOptions);
      this.logger.log(`Email sent to ${to} with template ${template}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.stack : String(error);
      this.logger.error(
        `Failed to send email to ${to} with template ${template}`,
        errorMessage,
      );
      throw new Error(`Failed to send email: ${errorMessage}`);
    }
  }

  async sendPasswordResetEmail(
    email: string,
    resetToken: string,
  ): Promise<void> {
    const resetUrl = `${this.frontendUrl}/reset-password?token=${encodeURIComponent(resetToken)}`;

    await this.sendEmail(
      email,
      `${this.appName} - Password Reset Request`,
      'password-reset',
      { resetUrl },
    );
  }
}
