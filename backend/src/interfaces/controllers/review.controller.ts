import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateReviewUseCase } from '@application/use-cases/reviews/create-review.usecase';
import { ListReviewsByProductUseCase } from '@application/use-cases/reviews/list-reviews-by-product.usecase';
import { GetAverageRatingUseCase } from '@application/use-cases/reviews/get-average-rating.usecase';
import { CreateReviewDto } from '@shared/dtos/review/create-review.dto';
import { ReviewResponseDto } from '@shared/dtos/review/review-response.dto';
import { Review } from '@domain/reviews/entities/review.entity';

@Controller('reviews')
export class ReviewController {
  constructor(
    private readonly createReviewUseCase: CreateReviewUseCase,
    private readonly listReviewsByProductUseCase: ListReviewsByProductUseCase,
    private readonly getAverageRatingUseCase: GetAverageRatingUseCase,
  ) {}

  private mapToResponseDto(review: Review): ReviewResponseDto {
    return new ReviewResponseDto({
      id: review.id,
      productId: review.productId,
      userId: review.userId,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    });
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<ReviewResponseDto> {
    const review = await this.createReviewUseCase.execute(createReviewDto);
    return this.mapToResponseDto(review);
  }

  @Get()
  async findByProduct(
    @Query('productId') productId: string,
  ): Promise<ReviewResponseDto[]> {
    const reviews = await this.listReviewsByProductUseCase.execute(productId);
    return reviews.map(this.mapToResponseDto);
  }

  @Get('average-rating/:productId')
  async getAverageRating(
    @Param('productId') productId: string,
  ): Promise<{ productId: string; averageRating: number }> {
    const average = await this.getAverageRatingUseCase.execute(productId);
    return { productId, averageRating: average };
  }
}
