import { Inject, Injectable } from '@nestjs/common';
import { Review } from '@domain/reviews/entities/review.entity';
import { IReviewRepository } from '@domain/reviews/repositories/review.repository';

@Injectable()
export class ListReviewsByProductUseCase {
  constructor(
    @Inject(IReviewRepository)
    private readonly reviewRepository: IReviewRepository,
  ) {}

  async execute(productId: string): Promise<Review[]> {
    return this.reviewRepository.findByProductId(productId);
  }
}