import { Test, TestingModule } from '@nestjs/testing';
import { ListReviewsByProductUseCase } from '@application/use-cases/reviews/list-reviews-by-product.usecase';
import { IReviewRepository } from '@domain/reviews/repositories/review.repository';
import { Review } from '@domain/reviews/entities/review.entity';

describe('ListReviewsByProductUseCase', () => {
  let useCase: ListReviewsByProductUseCase;
  let mockReviewRepository: jest.Mocked<IReviewRepository>;

  const productId = 'product-uuid-123';

  beforeEach(async () => {
    mockReviewRepository = {
      create: jest.fn(),
      findByProductId: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getAverageRatingByProductId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListReviewsByProductUseCase,
        { provide: IReviewRepository, useValue: mockReviewRepository },
      ],
    }).compile();

    useCase = module.get<ListReviewsByProductUseCase>(
      ListReviewsByProductUseCase,
    );
  });

  it('should return reviews for a given product ID', async () => {
    const reviews = [
      new Review(productId, 'user1', 5, 'Excellent', 'review-uuid1'),
      new Review(productId, 'user2', 4, 'Good', 'review-uuid2'),
    ];
    mockReviewRepository.findByProductId.mockResolvedValue(reviews);

    const result = await useCase.execute(productId);

    expect(result).toEqual(reviews);
    expect(mockReviewRepository.findByProductId).toHaveBeenCalledWith(
      productId,
    );
  });

  it('should return an empty array if no reviews found for product ID', async () => {
    mockReviewRepository.findByProductId.mockResolvedValue([]);
    const result = await useCase.execute(productId);
    expect(result).toEqual([]);
    expect(mockReviewRepository.findByProductId).toHaveBeenCalledWith(
      productId,
    );
  });
});
