import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IProductRepository } from '@domain/products/repositories/product.repository';

@Injectable()
export class DeleteProductUseCase {
  constructor(
    @Inject(IProductRepository)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    const deleted = await this.productRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Failed to delete product with ID "${id}"`);
    }
  }
}
