import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { appConfig } from './core/config/app.config';
import { UsersModule } from './modules/users/users.module';
import { KyselyModule } from 'nestjs-kysely';
import { PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { ATGuard } from './core/guards';
import {
  DatabaseExceptionFilter,
  MyZodValidationPipe,
  NoResultDBExceptionFilter,
  ValidationExceptionFilter,
} from './core';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 6000,
          limit: 10,
        },
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig],
    }),
    AuthModule,
    UsersModule,

    KyselyModule.forRootAsync({
      imports: [ConfigModule.forFeature(appConfig)],
      inject: [appConfig.KEY],
      useFactory: (configuration: ConfigType<typeof appConfig>) => {
        return {
          dialect: new PostgresDialect({
            pool: new Pool({
              host: configuration.host,
              port: +configuration.port,
              database: configuration.database,
              user: configuration.username,
              password: configuration.password,
              ssl: { rejectUnauthorized: true },
            }),
          }),
        };
      },
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ATGuard,
    },
    {
      provide: APP_PIPE,
      useClass: MyZodValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: ValidationExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: NoResultDBExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: DatabaseExceptionFilter,
    },
  ],
})
export class AppModule {}
