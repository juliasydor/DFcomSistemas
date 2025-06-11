import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Review } from '@domain/reviews/entities/review.entity';
import { IReviewRepository } from '@domain/reviews/repositories/review.repository';
import { CreateReviewDto } from '@shared/dtos/review/create-review.dto';
import { IProductRepository } from '@domain/products/repositories/product.repository';

@Injectable()
export class CreateReviewUseCase {
  constructor(
    @Inject(IReviewRepository)
    private readonly reviewRepository: IReviewRepository,
    @Inject(IProductRepository)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(createReviewDto: CreateReviewDto): Promise<Review> {
    const productExists = await this.productRepository.findById(
      createReviewDto.productId,
    );
    if (!productExists) {
      throw new NotFoundException(
        `Product with ID "${createReviewDto.productId}" not found.`,
      );
    }

    const review = new Review(
      createReviewDto.productId,
      createReviewDto.userId,
      createReviewDto.rating,
      createReviewDto.comment,
    );
    return this.reviewRepository.create(review);
  }
}
