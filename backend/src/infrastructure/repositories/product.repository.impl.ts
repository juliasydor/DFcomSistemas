import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product } from '@domain/products/entities/product.entity';
import { IProductRepository } from '@domain/products/repositories/product.repository';
import {
  ProductDocument,
  ProductModel,
} from '../database/schemas/product.schema';

@Injectable()
export class ProductRepositoryMongo implements IProductRepository {
  constructor(
    @InjectModel(ProductModel.name)
    private productModel: Model<ProductDocument>,
  ) {}

  private toDomain = (productDoc: ProductDocument): Product => {
    const id =
      productDoc._id instanceof Types.ObjectId
        ? productDoc._id.toString()
        : String(productDoc._id);

    return new Product(
      productDoc.name,
      productDoc.description,
      productDoc.price,
      productDoc.stock,
      id,
      productDoc.createdAt,
      productDoc.updatedAt,
    );
  };

  private toSchema = (product: Product): Partial<ProductModel> => {
    return {
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
    };
  };

  async create(product: Product): Promise<Product> {
    const createdProduct = new this.productModel(this.toSchema(product));
    const saved = await createdProduct.save();
    return this.toDomain(saved);
  }

  async findAll(): Promise<Product[]> {
    const products = await this.productModel.find().exec();
    return products.map(this.toDomain);
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.productModel.findById(id).exec();
    return product ? this.toDomain(product) : null;
  }

  async update(id: string, product: Partial<Product>): Promise<Product | null> {
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, this.toSchema(product as Product), { new: true })
      .exec();
    return updatedProduct ? this.toDomain(updatedProduct) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.productModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }
}
