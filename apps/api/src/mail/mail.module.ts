import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { MailService } from './mail.service';
import type { MailerOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-options.interface';
import type { TransportOptions } from 'nodemailer';
import mailConfig from './mail.config';

@Module({
  imports: [
    ConfigModule.forFeature(mailConfig),
    NestMailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): MailerOptions => {
        const isProd =
          configService.get<string>('app.nodeEnv') === 'production';
        // Get configuration values with proper type assertions
        const getConfig = <T>(
          key: string,
          isRequired = isProd,
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
          isProd,
        ) || { name: 'Titan Pomade', email: 'noreply@example.com' };

        const fromName = mailFrom.name ?? 'Titan Pomade';
        const fromEmail = mailFrom.email ?? 'noreply@example.com';

        // If not in production and mail config is missing, use a JSON transport fallback
        const hasSmtpConfig = !!host && !!port && !!user && !!password;
        const transport: string | TransportOptions = hasSmtpConfig
          ? {
              host,
              port,
              secure,
              auth: {
                user,
                pass: password,
              },
            }
          : ({ jsonTransport: true } as TransportOptions);

        return {
          transport,
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
