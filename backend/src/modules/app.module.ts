import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DatabaseModule } from '../infrastructure/database/connection/database.module';
import { ProductsModule } from './products.module';
import { ReviewsModule } from './reviews.module';
import { LoggingMiddleware } from '../interfaces/middleware/logging.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available globally
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`, // e.g. .env.development
      // You can add validation for env variables here using Joi or class-validator
    }),
    DatabaseModule,
    ProductsModule,
    ReviewsModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true, // Strip properties that do not have any decorators
        transform: true, // Automatically transform payloads to DTO instances
        forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
      }),
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
