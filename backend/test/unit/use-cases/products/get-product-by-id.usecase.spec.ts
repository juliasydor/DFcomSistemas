import { Test, TestingModule } from '@nestjs/testing';
import { GetProductByIdUseCase } from '@application/use-cases/products/get-product-by-id.usecase';
import { IProductRepository } from '@domain/products/repositories/product.repository';
import { Product } from '@domain/products/entities/product.entity';
import { NotFoundException } from '@nestjs/common';

describe('GetProductByIdUseCase', () => {
  let useCase: GetProductByIdUseCase;
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
        GetProductByIdUseCase,
        {
          provide: IProductRepository,
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetProductByIdUseCase>(GetProductByIdUseCase);
  });

  it('should return a product if found', async () => {
    const productId = 'test-id';
    const product = new Product('Test Product', 'Desc', 10, 5, productId);
    mockProductRepository.findById.mockResolvedValue(product);

    const result = await useCase.execute(productId);

    expect(result).toEqual(product);
    expect(mockProductRepository.findById).toHaveBeenCalledWith(productId);
  });

  it('should throw NotFoundException if product not found', async () => {
    const productId = 'non-existent-id';
    mockProductRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(productId)).rejects.toThrow(NotFoundException);
    expect(mockProductRepository.findById).toHaveBeenCalledWith(productId);
  });
});
