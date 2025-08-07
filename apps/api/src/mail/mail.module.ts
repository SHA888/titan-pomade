import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { MailService } from './mail.service';
import type { MailerOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-options.interface';
import type { Options as SMTPOptions } from 'nodemailer/lib/smtp-transport';

@Module({
  imports: [
    NestMailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): MailerOptions => {
        // Get configuration values with proper type assertions
        const getConfig = <T>(
          key: string,
          isRequired = true,
        ): T | undefined => {
          const value = configService.get<T>(key);
          if (isRequired && (value === undefined || value === null)) {
            throw new Error(`Missing required mail configuration: ${key}`);
          }
          return value;
        };

        // Get all required configuration values
        const host = getConfig<string>('mail.host');
        const port = getConfig<number>('mail.port');
        const secure = getConfig<boolean>('mail.secure', false) ?? false;
        const user = getConfig<string>('mail.user');
        const password = getConfig<string>('mail.password');

        const mailFrom = getConfig<{ name?: string; email?: string }>(
          'mail.from',
        );

        if (!mailFrom?.name || !mailFrom?.email) {
          throw new Error('Missing required mail.from configuration');
        }

        const { name: fromName, email: fromEmail } = mailFrom;

        const transport: SMTPOptions = {
          host,
          port,
          secure,
          auth: {
            user,
            pass: password,
          },
        };

        return {
          transport: transport,
          defaults: {
            from: `"${fromName}" <${fromEmail}>`,
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
