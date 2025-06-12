import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductController } from '@interfaces/controllers/product.controller';
import { CreateProductUseCase } from '@application/use-cases/products/create-product.usecase';
import { ListProductsUseCase } from '@application/use-cases/products/list-products.usecase';
import { GetProductByIdUseCase } from '@application/use-cases/products/get-product-by-id.usecase';
import { IProductRepository } from '@domain/products/repositories/product.repository';
import { ProductRepositoryMongo } from '@infrastructure/repositories/product.repository.impl';
import { UpdateProductUseCase } from '@application/use-cases/products/update-product.usecase';
import { DeleteProductUseCase } from '@application/use-cases/products/delete-product.usecase';
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
    UpdateProductUseCase,
    DeleteProductUseCase,
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
  ],
})
export class ProductsModule {}
