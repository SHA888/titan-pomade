import { DynamicModule, Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

@Module({})
export class LoggerModule {
  static forRoot(): DynamicModule {
    return {
      module: LoggerModule,
      imports: [
        PinoLoggerModule.forRoot({
          pinoHttp: {
            level: 'info',
            transport: {
              target: 'pino-pretty',
              options: {
                colorize: true,
                levelFirst: true,
                translateTime: 'yyyy-mm-dd HH:MM:ss',
                singleLine: true,
                ignore: 'pid,hostname',
              },
            },
          },
        }),
      ],
      exports: [PinoLoggerModule],
    };
  }
}
