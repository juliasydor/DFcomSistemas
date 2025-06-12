import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Product } from '@domain/products/entities/product.entity';
import { IProductRepository } from '@domain/products/repositories/product.repository';
import { UpdateProductDto } from '@/shared/dtos/product/update-product.dto';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(IProductRepository)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    try {
      const existingProduct = await this.productRepository.findById(id);
      if (!existingProduct) {
        throw new NotFoundException(`Product with ID "${id}" not found`);
      }

      existingProduct.updateDetails(
        updateProductDto.name,
        updateProductDto.description,
        updateProductDto.price,
        updateProductDto.stock,
      );

      const updatedProduct = await this.productRepository.update(
        id,
        existingProduct,
      );
      if (!updatedProduct) {
        throw new BadRequestException('Failed to update product');
      }

      return updatedProduct;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update product');
    }
  }
}
