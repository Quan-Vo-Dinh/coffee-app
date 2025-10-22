import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { AccessTokenGuard } from './guards/access-token.guard';
import { APIKeyGuard } from './guards/api-key.guard';
import { AuthenticationGuard } from './guards/authentication.guard';
import { HashingService } from './services/hashing.service';
import { PrismaService } from './services/prisma.service';
import { TokenService } from './services/token.service';

const LibsServices = [
  PrismaService,
  HashingService,
  TokenService,
  AccessTokenGuard,
  APIKeyGuard,
];

@Global()
@Module({
  providers: [
    ...LibsServices,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
  ],
  exports: LibsServices,
})
export class SharedModule {}
