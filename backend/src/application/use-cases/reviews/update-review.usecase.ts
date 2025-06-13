import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Review } from '@domain/reviews/entities/review.entity';
import { IReviewRepository } from '@domain/reviews/repositories/review.repository';
import { UpdateReviewDto } from '@/shared/dtos/review/update-review.dto';

@Injectable()
export class UpdateReviewUseCase {
  constructor(
    @Inject(IReviewRepository)
    private readonly reviewRepository: IReviewRepository,
  ) {}

  async execute(id: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const existingReview = await this.reviewRepository.findById(id);
    if (!existingReview) {
      throw new NotFoundException(`Review with ID "${id}" not found`);
    }

    existingReview.updateReview(
      updateReviewDto.rating,
      updateReviewDto.comment,
    );

    const updatedReview = await this.reviewRepository.update(
      id,
      existingReview,
    );
    if (!updatedReview) {
      throw new BadRequestException('Failed to update review');
    }

    return updatedReview;
  }
}
