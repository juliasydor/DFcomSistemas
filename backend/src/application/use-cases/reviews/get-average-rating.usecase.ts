import { Inject, Injectable } from '@nestjs/common';
import { IReviewRepository } from '@domain/reviews/repositories/review.repository';

@Injectable()
export class GetAverageRatingUseCase {
  constructor(
    @Inject(IReviewRepository)
    private readonly reviewRepository: IReviewRepository,
  ) {}

  async execute(productId: string): Promise<number> {
    return await this.reviewRepository.getAverageRatingByProductId(productId);
  }
}
