import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { ReviewRepositoryMongo } from '@infrastructure/repositories/review.repository.impl';
import {
  ReviewModel,
  ReviewDocument,
} from '@infrastructure/database/schemas/review.schema';
import { Review } from '@domain/reviews/entities/review.entity';
import { v4 as uuidv4 } from 'uuid';

describe('ReviewRepositoryMongo', () => {
  let repository: ReviewRepositoryMongo;
  let model: Model<ReviewDocument>;

  const mockReviewDoc = (review?: Partial<Review>): Partial<ReviewDocument> => {
    const id = review?.id || uuidv4();
    return {
      id: id,
      productId: review?.productId || 'prod-123',
      userId: review?.userId || 'user-456',
      rating: review?.rating || 5,
      comment: review?.comment || 'Great!',
      createdAt: review?.createdAt || new Date(),
      updatedAt: review?.updatedAt || new Date(),
      save: jest.fn().mockResolvedValue({
        id: id,
        productId: review?.productId || 'prod-123',
        userId: review?.userId || 'user-456',
        rating: review?.rating || 5,
        comment: review?.comment || 'Great!',
        createdAt: review?.createdAt || new Date(),
        updatedAt: review?.updatedAt || new Date(),
      } as ReviewDocument),
    } as Partial<ReviewDocument>;
  };

  const mockReviewEntity = (override: Partial<Review> = {}): Review => {
    return new Review(
      override.productId || 'prod-123',
      override.userId || 'user-456',
      override.rating || 5,
      override.comment || 'Great!',
      override.id || uuidv4(),
      override.createdAt,
      override.updatedAt,
    );
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewRepositoryMongo,
        {
          provide: getModelToken(ReviewModel.name),
          useValue: {
            new: jest.fn().mockImplementation((dto) => mockReviewDoc(dto)),
            constructor: jest
              .fn()
              .mockImplementation((dto) => mockReviewDoc(dto)),
            find: jest.fn(),
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            deleteOne: jest.fn(),
            aggregate: jest.fn(), // For average rating
            save: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<ReviewRepositoryMongo>(ReviewRepositoryMongo);
    model = module.get<Model<ReviewDocument>>(getModelToken(ReviewModel.name));

    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn(),
      select: jest.fn().mockReturnThis(),
    } as any);
    jest.spyOn(model, 'findOne').mockReturnValue({ exec: jest.fn() } as any);
    jest
      .spyOn(model, 'findOneAndUpdate')
      .mockReturnValue({ exec: jest.fn() } as any);
    jest.spyOn(model, 'deleteOne').mockReturnValue({ exec: jest.fn() } as any);
    jest.spyOn(model, 'aggregate').mockReturnValue({ exec: jest.fn() } as any);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a review', async () => {
      const reviewEntity = mockReviewEntity();
      const reviewDoc = mockReviewDoc(reviewEntity);

      const saveSpy = jest.fn().mockResolvedValue(reviewDoc);
      (model.new as jest.Mock).mockImplementation(() => ({ save: saveSpy }));
      (model.constructor as jest.Mock).mockImplementation(() => ({
        save: saveSpy,
      }));

      const result = await repository.create(reviewEntity);

      expect(saveSpy).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Review);
      expect(result.id).toEqual(reviewEntity.id);
    });
  });

  describe('findByProductId', () => {
    it('should return reviews for a product', async () => {
      const productId = 'prod-abc';
      const reviewDocs = [
        mockReviewDoc({ productId }),
        mockReviewDoc({ productId, comment: 'Okay' }),
      ] as ReviewDocument[];
      (model.find({ productId }).exec as jest.Mock).mockResolvedValue(
        reviewDocs,
      );

      const result = await repository.findByProductId(productId);

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Review);
      expect(result[0].productId).toEqual(productId);
    });
  });

  describe('getAverageRatingByProductId', () => {
    it('should calculate and return the average rating', async () => {
      const productId = 'prod-for-avg';
      const reviewsData = [{ rating: 5 }, { rating: 4 }, { rating: 3 }];
      // Mock the find().exec() part of the getAverageRatingByProductId method
      (model.find({ productId }, 'rating').exec as jest.Mock).mockResolvedValue(
        reviewsData,
      );

      const result = await repository.getAverageRatingByProductId(productId);
      expect(result).toEqual(4); // (5+4+3)/3
    });

    it('should return 0 if no reviews for average calculation', async () => {
      const productId = 'prod-no-reviews';
      (model.find({ productId }, 'rating').exec as jest.Mock).mockResolvedValue(
        [],
      );
      const result = await repository.getAverageRatingByProductId(productId);
      expect(result).toEqual(0);
    });
  });
});
