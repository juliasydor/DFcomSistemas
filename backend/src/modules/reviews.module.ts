import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewController } from '@interfaces/controllers/review.controller';
import { CreateReviewUseCase } from '@application/use-cases/reviews/create-review.usecase';
import { ListReviewsByProductUseCase } from '@application/use-cases/reviews/list-reviews-by-product.usecase';
import { GetAverageRatingUseCase } from '@application/use-cases/reviews/get-average-rating.usecase';
import { IReviewRepository } from '@domain/reviews/repositories/review.repository';
import { ReviewRepositoryMongo } from '@infrastructure/repositories/review.repository.impl';
import { UpdateReviewUseCase } from '@application/use-cases/reviews/update-review.usecase';
import { DeleteReviewUseCase } from '@application/use-cases/reviews/delete-review.usecase';
import {
  ReviewModel,
  ReviewSchema,
} from '@infrastructure/database/schemas/review.schema';
import { ProductsModule } from './products.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ReviewModel.name, schema: ReviewSchema },
    ]),
    ProductsModule,
  ],
  controllers: [ReviewController],
  providers: [
    CreateReviewUseCase,
    ListReviewsByProductUseCase,
    GetAverageRatingUseCase,
    UpdateReviewUseCase,
    DeleteReviewUseCase,
    {
      provide: IReviewRepository,
      useClass: ReviewRepositoryMongo,
    },
  ],
  exports: [IReviewRepository],
})
export class ReviewsModule {}
