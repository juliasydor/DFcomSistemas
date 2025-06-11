import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '@domain/products/entities/product.entity';
import { IProductRepository } from '@domain/products/repositories/product.repository';

@Injectable()
export class GetProductByIdUseCase {
  constructor(
    @Inject(IProductRepository)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(id: string): Promise<Product> {
    try {
      const product = await this.productRepository.findById(id);
      if (!product) {
        throw new NotFoundException(`Product with ID "${id}" not found`);
      }
      return product;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`Failed to find product with ID "${id}"`);
    }
  }
}
