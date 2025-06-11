import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductController } from '@interfaces/controllers/product.controller';
import { CreateProductUseCase } from '@application/use-cases/products/create-product.usecase';
import { ListProductsUseCase } from '@application/use-cases/products/list-products.usecase';
import { GetProductByIdUseCase } from '@application/use-cases/products/get-product-by-id.usecase';
import { IProductRepository } from '@domain/products/repositories/product.repository';
import { ProductRepositoryMongo } from '@infrastructure/repositories/product.repository.impl';
import {
  ProductModel,
  ProductSchema,
} from '@infrastructure/database/schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductModel.name, schema: ProductSchema },
    ]),
  ],
  controllers: [ProductController],
  providers: [
    CreateProductUseCase,
    ListProductsUseCase,
    GetProductByIdUseCase,
    {
      provide: IProductRepository,
      useClass: ProductRepositoryMongo,
    },
  ],
  exports: [
    IProductRepository,
    CreateProductUseCase,
    ListProductsUseCase,
    GetProductByIdUseCase,
  ], // Export repository for other modules if needed (e.g. ReviewsModule)
})
export class ProductsModule {}
