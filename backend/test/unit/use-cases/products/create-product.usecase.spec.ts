import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductUseCase } from '@application/use-cases/products/create-product.usecase';
import { IProductRepository } from '@domain/products/repositories/product.repository';
import { Product } from '@domain/products/entities/product.entity';
import { CreateProductDto } from '@shared/dtos/product/create-product.dto';

describe('CreateProductUseCase', () => {
  let useCase: CreateProductUseCase;
  let mockProductRepository: jest.Mocked<IProductRepository>;

  beforeEach(async () => {
    mockProductRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateProductUseCase,
        {
          provide: IProductRepository,
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateProductUseCase>(CreateProductUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should create a product and return it', async () => {
    const createProductDto: CreateProductDto = {
      name: 'Test Product',
      description: 'Test Description',
      price: 100,
      stock: 10,
    };

    const expectedProduct = new Product(
      createProductDto.name,
      createProductDto.description,
      createProductDto.price,
      createProductDto.stock,
    );
    // Match the structure, not the instance if ID is generated inside
    mockProductRepository.create.mockImplementation(
      async (product: Product) => product,
    );

    const result = await useCase.execute(createProductDto);

    expect(mockProductRepository.create).toHaveBeenCalledTimes(1);
    // Check properties excluding generated ones like id, createdAt, updatedAt if they are not predictable
    expect(result.name).toEqual(expectedProduct.name);
    expect(result.description).toEqual(expectedProduct.description);
    expect(result.price).toEqual(expectedProduct.price);
    expect(result.stock).toEqual(expectedProduct.stock);
    expect(result).toBeInstanceOf(Product);
  });

  it('should throw an error if product validation fails in entity', async () => {
    const createProductDto: CreateProductDto = {
      name: '', // Invalid name
      description: 'Test Description',
      price: 100,
      stock: 10,
    };

    // The Product entity constructor should throw
    await expect(useCase.execute(createProductDto)).rejects.toThrow(
      'Product name cannot be empty.',
    );
    expect(mockProductRepository.create).not.toHaveBeenCalled();
  });
});
