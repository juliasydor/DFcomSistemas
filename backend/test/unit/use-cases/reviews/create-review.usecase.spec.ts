import { Test, TestingModule } from '@nestjs/testing';
import { CreateReviewUseCase } from '@application/use-cases/reviews/create-review.usecase';
import { IReviewRepository } from '@domain/reviews/repositories/review.repository';
import { IProductRepository } from '@domain/products/repositories/product.repository';
import { Review } from '@domain/reviews/entities/review.entity';
import { Product } from '@domain/products/entities/product.entity';
import { CreateReviewDto } from '@shared/dtos/review/create-review.dto';
import { NotFoundException } from '@nestjs/common';

describe('CreateReviewUseCase', () => {
  let useCase: CreateReviewUseCase;
  let mockReviewRepository: jest.Mocked<IReviewRepository>;
  let mockProductRepository: jest.Mocked<IProductRepository>;

  const productId = 'product-uuid-123';
  const userId = 'user-uuid-456';

  beforeEach(async () => {
    mockReviewRepository = {
      create: jest.fn(),
      findByProductId: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getAverageRatingByProductId: jest.fn(),
    };
    mockProductRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateReviewUseCase,
        { provide: IReviewRepository, useValue: mockReviewRepository },
        { provide: IProductRepository, useValue: mockProductRepository },
      ],
    }).compile();

    useCase = module.get<CreateReviewUseCase>(CreateReviewUseCase);
  });

  it('should create a review if product exists', async () => {
    const createReviewDto: CreateReviewDto = {
      productId,
      userId,
      rating: 5,
      comment: 'Great product!',
    };
    const mockProduct = new Product('Test Prod', 'Desc', 10, 1, productId);
    mockProductRepository.findById.mockResolvedValue(mockProduct);

    const expectedReview = new Review(
      createReviewDto.productId,
      createReviewDto.userId,
      createReviewDto.rating,
      createReviewDto.comment,
    );
    mockReviewRepository.create.mockImplementation(
      async (review: Review) => review,
    );

    const result = await useCase.execute(createReviewDto);

    expect(mockProductRepository.findById).toHaveBeenCalledWith(productId);
    expect(mockReviewRepository.create).toHaveBeenCalledTimes(1);
    expect(result.productId).toEqual(expectedReview.productId);
    expect(result.comment).toEqual(expectedReview.comment);
    expect(result).toBeInstanceOf(Review);
  });

  it('should throw NotFoundException if product does not exist', async () => {
    const createReviewDto: CreateReviewDto = {
      productId: 'non-existent-product-id',
      userId,
      rating: 5,
      comment: 'Great product!',
    };
    mockProductRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(createReviewDto)).rejects.toThrow(
      NotFoundException,
    );
    expect(mockProductRepository.findById).toHaveBeenCalledWith(
      'non-existent-product-id',
    );
    expect(mockReviewRepository.create).not.toHaveBeenCalled();
  });

  it('should throw an error if review validation fails in entity', async () => {
    const createReviewDto: CreateReviewDto = {
      productId,
      userId,
      rating: 6, // Invalid rating
      comment: 'Great product!',
    };
    const mockProduct = new Product('Test Prod', 'Desc', 10, 1, productId);
    mockProductRepository.findById.mockResolvedValue(mockProduct);

    await expect(useCase.execute(createReviewDto)).rejects.toThrow(
      'Rating must be between 1 and 5.',
    );
    expect(mockReviewRepository.create).not.toHaveBeenCalled();
  });
});
