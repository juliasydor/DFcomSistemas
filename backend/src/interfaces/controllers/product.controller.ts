import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UpdateProductUseCase } from '@application/use-cases/products/update-product.usecase';
import { DeleteProductUseCase } from '@application/use-cases/products/delete-product.usecase';
import { UpdateProductDto } from '@shared/dtos/product/update-product.dto';
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
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
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

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const product = await this.updateProductUseCase.execute(
      id,
      updateProductDto,
    );
    return this.mapToResponseDto(product);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteProductUseCase.execute(id);
  }
}
