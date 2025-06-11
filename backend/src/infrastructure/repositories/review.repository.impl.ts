import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review } from '@domain/reviews/entities/review.entity';
import { IReviewRepository } from '@domain/reviews/repositories/review.repository';
import { ReviewDocument, ReviewModel } from '../database/schemas/review.schema';

@Injectable()
export class ReviewRepositoryMongo implements IReviewRepository {
  constructor(
    @InjectModel(ReviewModel.name)
    private reviewModel: Model<ReviewDocument>,
  ) {}

  private toDomain = (reviewDoc: ReviewDocument): Review => {
    const id =
      reviewDoc._id instanceof Types.ObjectId
        ? reviewDoc._id.toString()
        : String(reviewDoc._id);

    return new Review(
      reviewDoc.productId,
      reviewDoc.userId,
      reviewDoc.rating,
      reviewDoc.comment,
      id,
      reviewDoc.createdAt,
      reviewDoc.updatedAt,
    );
  };

  private toSchema = (review: Review): Partial<ReviewModel> => {
    return {
      productId: review.productId,
      userId: review.userId,
      rating: review.rating,
      comment: review.comment,
    };
  };

  async create(review: Review): Promise<Review> {
    const createdReview = new this.reviewModel(this.toSchema(review));
    const saved = await createdReview.save();
    return this.toDomain(saved);
  }

  async findByProductId(productId: string): Promise<Review[]> {
    const reviews = await this.reviewModel.find({ productId }).exec();
    return reviews.map(this.toDomain);
  }

  async findById(id: string): Promise<Review | null> {
    const review = await this.reviewModel.findById(id).exec();
    return review ? this.toDomain(review) : null;
  }

  async update(
    id: string,
    reviewData: Partial<Review>,
  ): Promise<Review | null> {
    const updatedReview = await this.reviewModel
      .findByIdAndUpdate(id, this.toSchema(reviewData as Review), { new: true })
      .exec();
    return updatedReview ? this.toDomain(updatedReview) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.reviewModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }

  async getAverageRatingByProductId(productId: string): Promise<number> {
    interface AggregationResult {
      _id: null;
      avgRating: number;
    }

    const result = await this.reviewModel
      .aggregate<AggregationResult>([
        { $match: { productId } },
        { $group: { _id: null, avgRating: { $avg: '$rating' } } },
      ])
      .exec();
    return result[0]?.avgRating || 0;
  }
}
