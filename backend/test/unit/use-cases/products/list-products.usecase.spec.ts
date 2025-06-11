import { Test, TestingModule } from '@nestjs/testing';
import { ListProductsUseCase } from '@application/use-cases/products/list-products.usecase';
import { IProductRepository } from '@domain/products/repositories/product.repository';
import { Product } from '@domain/products/entities/product.entity';

describe('ListProductsUseCase', () => {
  let useCase: ListProductsUseCase;
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
        ListProductsUseCase,
        {
          provide: IProductRepository,
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    useCase = module.get<ListProductsUseCase>(ListProductsUseCase);
  });

  it('should return an array of products', async () => {
    const products = [
      new Product('Product 1', 'Desc 1', 10, 5, 'uuid1'),
      new Product('Product 2', 'Desc 2', 20, 3, 'uuid2'),
    ];
    mockProductRepository.findAll.mockResolvedValue(products);

    const result = await useCase.execute();

    expect(result).toEqual(products);
    expect(mockProductRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return an empty array if no products exist', async () => {
    mockProductRepository.findAll.mockResolvedValue([]);
    const result = await useCase.execute();
    expect(result).toEqual([]);
    expect(mockProductRepository.findAll).toHaveBeenCalledTimes(1);
  });
});
