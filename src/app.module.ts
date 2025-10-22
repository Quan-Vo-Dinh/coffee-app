import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ZodSerializerInterceptor } from 'nestjs-zod';

import { validateEnv } from 'src/libs/config';
import { CatchEverythingFilter } from 'src/libs/filter/catch-everything.filter';
import { HttpExceptionFilter } from 'src/libs/filter/http-exception.filter';
import CustomZodValidationPipe from 'src/libs/pipes/custom-zod-validation.pipe';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './libs/libs.module';
import { MediaModule } from './media/media.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: [
        `.env.${process.env.NODE_ENV || 'development'}.local`,
        `.env.${process.env.NODE_ENV || 'development'}`,
        '.env.local',
        '.env',
      ],
      validate: validateEnv, // Validate với Zod schema
      expandVariables: true, // Cho phép sử dụng ${VAR} trong .env
    }),

    SharedModule,
    AuthModule,
    MediaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: CustomZodValidationPipe,
    },
    { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
    {
      provide: APP_FILTER, // show lỗi khi nó serialize bị lỗi
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: CatchEverythingFilter,
    },
  ],
})
export class AppModule {}
