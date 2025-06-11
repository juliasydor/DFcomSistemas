import { Inject, Injectable } from '@nestjs/common';
import { Product } from '@domain/products/entities/product.entity';
import { IProductRepository } from '@domain/products/repositories/product.repository';

@Injectable()
export class ListProductsUseCase {
  constructor(
    @Inject(IProductRepository)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(): Promise<Product[]> {
    try {
      const products = await this.productRepository.findAll();
      return products;
    } catch {
      return [];
    }
  }
}
