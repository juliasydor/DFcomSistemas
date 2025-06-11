import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface ProductDocument extends Document {
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

@Schema({ timestamps: true, versionKey: false })
export class ProductModel {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true })
  price!: number;

  @Prop({ required: true })
  stock!: number;
}

export const ProductSchema = SchemaFactory.createForClass(ProductModel);
