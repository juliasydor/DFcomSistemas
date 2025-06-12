import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateReviewUseCase } from '@application/use-cases/reviews/create-review.usecase';
import { ListReviewsByProductUseCase } from '@application/use-cases/reviews/list-reviews-by-product.usecase';
import { GetAverageRatingUseCase } from '@application/use-cases/reviews/get-average-rating.usecase';
import { UpdateReviewUseCase } from '@application/use-cases/reviews/update-review.usecase';
import { DeleteReviewUseCase } from '@application/use-cases/reviews/delete-review.usecase';
import { CreateReviewDto } from '@shared/dtos/review/create-review.dto';
import { UpdateReviewDto } from '@shared/dtos/review/update-review.dto';
import { ReviewResponseDto } from '@shared/dtos/review/review-response.dto';
import { Review } from '@domain/reviews/entities/review.entity';

@Controller('reviews')
export class ReviewController {
  constructor(
    private readonly createReviewUseCase: CreateReviewUseCase,
    private readonly listReviewsByProductUseCase: ListReviewsByProductUseCase,
    private readonly getAverageRatingUseCase: GetAverageRatingUseCase,
    private readonly updateReviewUseCase: UpdateReviewUseCase,
    private readonly deleteReviewUseCase: DeleteReviewUseCase,
  ) {}

  private mapToResponseDto = (review: Review): ReviewResponseDto => {
    return new ReviewResponseDto({
      id: review.id,
      productId: review.productId,
      userId: review.userId,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    });
  };

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<ReviewResponseDto> {
    const review = await this.createReviewUseCase.execute(createReviewDto);
    return this.mapToResponseDto(review);
  }

  @Get()
  async findByProductQuery(
    @Query('productId') productId: string,
  ): Promise<ReviewResponseDto[]> {
    const reviews = await this.listReviewsByProductUseCase.execute(productId);
    return reviews.map(this.mapToResponseDto);
  }

  @Get('product/:productId')
  async findByProduct(
    @Param('productId') productId: string,
  ): Promise<ReviewResponseDto[]> {
    const reviews = await this.listReviewsByProductUseCase.execute(productId);
    return reviews.map(this.mapToResponseDto);
  }

  @Get('product/:productId/average')
  async getAverageRating(
    @Param('productId') productId: string,
  ): Promise<{ productId: string; averageRating: number }> {
    const average = await this.getAverageRatingUseCase.execute(productId);
    return { productId, averageRating: average };
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<ReviewResponseDto> {
    const review = await this.updateReviewUseCase.execute(id, updateReviewDto);
    return this.mapToResponseDto(review);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteReviewUseCase.execute(id);
  }
}
