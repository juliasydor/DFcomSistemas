export class ReviewResponseDto {
  id!: string;
  productId!: string;
  userId!: string;
  rating!: number;
  comment!: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(partial: Partial<ReviewResponseDto>) {
    Object.assign(this, partial);
  }
}
