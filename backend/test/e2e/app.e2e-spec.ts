import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@modules/app.module';
import { ConfigModule } from '@nestjs/config';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
          ignoreEnvFile: process.env.CI ? true : false,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
  });

  it('/api/v1 (GET health check - if you add one)', () => {
    expect(true).toBe(true);
  });

  describe('/products', () => {
    let productId: string;
    const productPayload = {
      name: 'E2E Test Product',
      description: 'A product created during E2E testing',
      price: 99.99,
      stock: 10,
    };

    it('(POST) /products - should create a product', async () => {
      return request(app.getHttpServer())
        .post('/api/v1/products')
        .send(productPayload)
        .expect(201)
        .then((res: { body: { id: string; name: string } }) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toEqual(productPayload.name);
          productId = res.body.id;
        });
    });

    it('(GET) /products - should get all products', () => {
      return request(app.getHttpServer())
        .get('/api/v1/products')
        .expect(200)
        .then((res: { body: { length: number } }) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThanOrEqual(1);
        });
    });

    it('(GET) /products/:id - should get a specific product', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/products/${productId}`)
        .expect(200)
        .then((res: { body: { id: string; name: string } }) => {
          expect(res.body.id).toEqual(productId);
          expect(res.body.name).toEqual(productPayload.name);
        });
    });
  });

  describe('/reviews', () => {
    let createdProductId: string;
    const reviewPayload = {
      userId: 'e2e-user-123',
      rating: 5,
      comment: 'Excellent product from E2E test!',
    };

    beforeAll(async () => {
      const productRes: { body: { id: string } } = await request(
        app.getHttpServer(),
      )
        .post('/api/v1/products')
        .send({
          name: 'Product for Review E2E',
          description: 'Desc',
          price: 10,
          stock: 5,
        });
      createdProductId = productRes.body.id;
    });

    it('(POST) /reviews - should create a review for a product', () => {
      return request(app.getHttpServer())
        .post('/api/v1/reviews')
        .send({ ...reviewPayload, productId: createdProductId })
        .expect(201)
        .then(
          (res: {
            body: { id: string; productId: string; comment: string };
          }) => {
            expect(res.body).toHaveProperty('id');
            expect(res.body.productId).toEqual(createdProductId);
            expect(res.body.comment).toEqual(reviewPayload.comment);
          },
        );
    });

    it('(GET) /reviews?productId=:id - should get reviews for a product', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/reviews?productId=${createdProductId}`)
        .expect(200)
        .then((res: { body: { productId: string }[] }) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThanOrEqual(1);
          expect(res.body[0].productId).toEqual(createdProductId);
        });
    });

    it('(GET) /reviews/average-rating/:productId - should get average rating for a product', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/reviews/average-rating/${createdProductId}`)
        .expect(200)
        .then((res: { body: { productId: string; averageRating: number } }) => {
          expect(res.body).toHaveProperty('productId', createdProductId);
          expect(res.body).toHaveProperty('averageRating');
          expect(typeof res.body.averageRating).toBe('number');
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
