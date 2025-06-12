import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IReviewRepository } from '@domain/reviews/repositories/review.repository';

@Injectable()
export class DeleteReviewUseCase {
  constructor(
    @Inject(IReviewRepository)
    private readonly reviewRepository: IReviewRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const review = await this.reviewRepository.findById(id);
    if (!review) {
      throw new NotFoundException(`Review with ID "${id}" not found`);
    }

    const deleted = await this.reviewRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Failed to delete review with ID "${id}"`);
    }
  }
}
