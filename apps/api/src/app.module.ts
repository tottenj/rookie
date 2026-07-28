import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_PIPE, APP_INTERCEPTOR, APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ZodValidationPipe, ZodSerializerInterceptor } from 'nestjs-zod';
import { ZodSerializationExceptionFilter } from './common/filters/zodSerializationExceptionFilter';

import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from './infrastructure/firebase/firebase.module';
import { PrismaModule } from './infrastructure/database/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { FirebaseAuthGuard } from './auth/guards/firebase-auth.guard';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    FirebaseModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ZodSerializationExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: FirebaseAuthGuard,
    },
  ],
})
export class AppModule {}
