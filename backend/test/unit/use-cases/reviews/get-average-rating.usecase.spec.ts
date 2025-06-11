import { Test, TestingModule } from '@nestjs/testing';
import { GetAverageRatingUseCase } from '@application/use-cases/reviews/get-average-rating.usecase';
import { IReviewRepository } from '@domain/reviews/repositories/review.repository';

describe('GetAverageRatingUseCase', () => {
  let useCase: GetAverageRatingUseCase;
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
        GetAverageRatingUseCase,
        { provide: IReviewRepository, useValue: mockReviewRepository },
      ],
    }).compile();

    useCase = module.get<GetAverageRatingUseCase>(GetAverageRatingUseCase);
  });

  it('should return the average rating for a product', async () => {
    const averageRating = 4.5;
    mockReviewRepository.getAverageRatingByProductId.mockResolvedValue(
      averageRating,
    );

    const result = await useCase.execute(productId);

    expect(result).toEqual(averageRating);
    expect(
      mockReviewRepository.getAverageRatingByProductId,
    ).toHaveBeenCalledWith(productId);
  });

  it('should return 0 if no reviews exist for the product', async () => {
    mockReviewRepository.getAverageRatingByProductId.mockResolvedValue(0);
    const result = await useCase.execute(productId);
    expect(result).toEqual(0);
  });
});
