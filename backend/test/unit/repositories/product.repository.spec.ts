// For repository implementation tests, you'd typically use an in-memory database
// or mock the Mongoose model directly. Here's an example mocking the model.
// For a more robust test, consider using `mongodb-memory-server`.

import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { ProductRepositoryMongo } from '@infrastructure/repositories/product.repository.impl';
import {
  ProductModel,
  ProductDocument,
} from '@infrastructure/database/schemas/product.schema';
import { Product } from '@domain/products/entities/product.entity';
import { v4 as uuidv4 } from 'uuid';

describe('ProductRepositoryMongo', () => {
  let repository: ProductRepositoryMongo;
  let model: Model<ProductDocument>;

  const mockProductDoc = (
    product?: Partial<Product>,
  ): Partial<ProductDocument> => {
    const id = product?.id || uuidv4();
    return {
      id: id,
      name: product?.name || 'Test Product',
      description: product?.description || 'Test Description',
      price: product?.price || 100,
      stock: product?.stock || 10,
      createdAt: product?.createdAt || new Date(),
      updatedAt: product?.updatedAt || new Date(),
      // Mongoose document methods (illustrative)
      save: jest.fn().mockResolvedValue({
        id: id,
        name: product?.name || 'Test Product',
        description: product?.description || 'Test Description',
        price: product?.price || 100,
        stock: product?.stock || 10,
        createdAt: product?.createdAt || new Date(),
        updatedAt: product?.updatedAt || new Date(),
      } as ProductDocument),
    } as Partial<ProductDocument>;
  };

  const mockProductEntity = (override: Partial<Product> = {}): Product => {
    return new Product(
      override.name || 'Test Product',
      override.description || 'Test Description',
      override.price || 100,
      override.stock || 10,
      override.id || uuidv4(),
      override.createdAt,
      override.updatedAt,
    );
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductRepositoryMongo,
        {
          provide: getModelToken(ProductModel.name),
          useValue: {
            new: jest.fn().mockImplementation((dto) => mockProductDoc(dto)),
            constructor: jest
              .fn()
              .mockImplementation((dto) => mockProductDoc(dto)),
            find: jest.fn(),
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            deleteOne: jest.fn(),
            save: jest.fn(), // Though usually called on instance
            exec: jest.fn(), // Common for query execution
          },
        },
      ],
    }).compile();

    repository = module.get<ProductRepositoryMongo>(ProductRepositoryMongo);
    model = module.get<Model<ProductDocument>>(
      getModelToken(ProductModel.name),
    );

    // Mock exec globally for chained queries
    jest.spyOn(model, 'find').mockReturnValue({ exec: jest.fn() } as any);
    jest.spyOn(model, 'findOne').mockReturnValue({ exec: jest.fn() } as any);
    jest
      .spyOn(model, 'findOneAndUpdate')
      .mockReturnValue({ exec: jest.fn() } as any);
    jest.spyOn(model, 'deleteOne').mockReturnValue({ exec: jest.fn() } as any);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a product', async () => {
      const productEntity = mockProductEntity();
      const productDoc = mockProductDoc(productEntity);

      // Mock the model instance's save method
      const saveSpy = jest.fn().mockResolvedValue(productDoc);
      (model.new as jest.Mock).mockImplementation(() => ({ save: saveSpy }));
      (model.constructor as jest.Mock).mockImplementation(() => ({
        save: saveSpy,
      }));

      const result = await repository.create(productEntity);

      expect(saveSpy).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Product);
      expect(result.id).toEqual(productEntity.id);
      expect(result.name).toEqual(productEntity.name);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const productDocs = [
        mockProductDoc(),
        mockProductDoc({ name: 'Product 2' }),
      ] as ProductDocument[];
      (model.find().exec as jest.Mock).mockResolvedValue(productDocs);

      const result = await repository.findAll();

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Product);
      expect(result[0].name).toEqual(productDocs[0].name);
    });
  });

  describe('findById', () => {
    it('should return a product if found', async () => {
      const productId = 'some-uuid';
      const productDoc = mockProductDoc({ id: productId });
      (model.findOne({ id: productId }).exec as jest.Mock).mockResolvedValue(
        productDoc,
      );

      const result = await repository.findById(productId);

      expect(result).toBeInstanceOf(Product);
      expect(result?.id).toEqual(productId);
    });

    it('should return null if product not found', async () => {
      (
        model.findOne({ id: 'not-found-id' }).exec as jest.Mock
      ).mockResolvedValue(null);
      const result = await repository.findById('not-found-id');
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update and return the product', async () => {
      const productId = 'update-uuid';
      const updateData: Partial<Product> = { name: 'Updated Name' };
      const updatedDoc = mockProductDoc({
        id: productId,
        name: 'Updated Name',
      });

      (
        model.findOneAndUpdate(
          { id: productId },
          { $set: updateData },
          { new: true },
        ).exec as jest.Mock
      ).mockResolvedValue(updatedDoc);

      const result = await repository.update(productId, updateData);

      expect(result).toBeInstanceOf(Product);
      expect(result?.id).toEqual(productId);
      expect(result?.name).toEqual('Updated Name');
    });

    it('should return null if product to update is not found', async () => {
      (
        model.findOneAndUpdate(
          { id: 'not-found-id' },
          { $set: {} },
          { new: true },
        ).exec as jest.Mock
      ).mockResolvedValue(null);
      const result = await repository.update('not-found-id', { name: 'test' });
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should return true if product is deleted', async () => {
      (
        model.deleteOne({ id: 'delete-id' }).exec as jest.Mock
      ).mockResolvedValue({ deletedCount: 1 });
      const result = await repository.delete('delete-id');
      expect(result).toBe(true);
    });

    it('should return false if product not found for deletion', async () => {
      (
        model.deleteOne({ id: 'not-found-id' }).exec as jest.Mock
      ).mockResolvedValue({ deletedCount: 0 });
      const result = await repository.delete('not-found-id');
      expect(result).toBe(false);
    });
  });
});
