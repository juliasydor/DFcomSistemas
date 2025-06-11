import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateProductUseCase } from '@application/use-cases/products/create-product.usecase';
import { ListProductsUseCase } from '@application/use-cases/products/list-products.usecase';
import { GetProductByIdUseCase } from '@application/use-cases/products/get-product-by-id.usecase';
import { CreateProductDto } from '@shared/dtos/product/create-product.dto';
import { ProductResponseDto } from '@shared/dtos/product/product-response.dto';
import { Product } from '@domain/products/entities/product.entity';

@Controller('products')
export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly getProductByIdUseCase: GetProductByIdUseCase,
  ) {}

  private mapToResponseDto = (product: Product): ProductResponseDto => {
    return new ProductResponseDto({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });
  };

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const product = await this.createProductUseCase.execute(createProductDto);
    return this.mapToResponseDto(product);
  }

  @Get()
  async findAll(): Promise<ProductResponseDto[]> {
    const products = await this.listProductsUseCase.execute();
    return products.map(this.mapToResponseDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProductResponseDto> {
    const product = await this.getProductByIdUseCase.execute(id);
    return this.mapToResponseDto(product);
  }
}
