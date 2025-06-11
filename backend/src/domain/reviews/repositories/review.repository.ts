import { Review } from '../entities/review.entity';

export interface IReviewRepository {
  create(review: Review): Promise<Review>;
  findByProductId(productId: string): Promise<Review[]>;
  findById(id: string): Promise<Review | null>;
  update(id: string, review: Partial<Review>): Promise<Review | null>;
  delete(id: string): Promise<boolean>;
  getAverageRatingByProductId(productId: string): Promise<number>;
}

export const IReviewRepository = Symbol('IReviewRepository');
