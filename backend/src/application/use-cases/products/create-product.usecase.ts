import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { Product } from '@domain/products/entities/product.entity';
import { IProductRepository } from '@domain/products/repositories/product.repository';
import { CreateProductDto } from '@shared/dtos/product/create-product.dto';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(IProductRepository)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const product = new Product(
        createProductDto.name,
        createProductDto.description,
        createProductDto.price,
        createProductDto.stock,
      );

      return await this.productRepository.create(product);
    } catch {
      throw new BadRequestException('Failed to create product');
    }
  }
}
