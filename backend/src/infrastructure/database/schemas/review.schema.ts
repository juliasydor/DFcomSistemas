import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface ReviewDocument extends Document {
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

@Schema({ timestamps: true, versionKey: false })
export class ReviewModel {
  @Prop({ required: true, index: true })
  productId!: string;

  @Prop({ required: true })
  userId!: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating!: number;

  @Prop({ required: true })
  comment!: string;
}

export const ReviewSchema = SchemaFactory.createForClass(ReviewModel);
