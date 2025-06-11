import { v4 as uuidv4 } from 'uuid';

export class Review {
  id: string;
  productId: string;
  userId: string; // Assuming reviews are tied to a user
  rating: number; // e.g., 1-5
  comment: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    productId: string,
    userId: string,
    rating: number,
    comment: string,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id || uuidv4();
    this.productId = productId;
    this.userId = userId;
    this.rating = rating;
    this.comment = comment;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
    this.validate();
  }

  private validate() {
    if (!this.productId) {
      throw new Error('Product ID is required for a review.');
    }
    if (!this.userId) {
      throw new Error('User ID is required for a review.');
    }
    if (this.rating < 1 || this.rating > 5) {
      throw new Error('Rating must be between 1 and 5.');
    }
    if (!this.comment || this.comment.trim().length === 0) {
      throw new Error('Review comment cannot be empty.');
    }
  }

  updateReview(rating?: number, comment?: string) {
    if (rating !== undefined) this.rating = rating;
    if (comment !== undefined) this.comment = comment;
    this.updatedAt = new Date();
    this.validate();
  }
}
