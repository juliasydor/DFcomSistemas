import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@modules/app.module';
import { ConfigModule } from '@nestjs/config';
// It's good practice to use a separate test database or mock the database layer for E2E.
// For simplicity, this example might hit the actual DB if not configured for testing.
// Consider using mongodb-memory-server for E2E tests.

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        // Override ConfigModule for testing if needed, e.g., to point to a test DB
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test', // Ensure you have a .env.test or similar
          ignoreEnvFile: process.env.CI ? true : false, // Ignore .env file in CI if vars are set directly
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
    // Example: if you add a root GET endpoint to AppModule or a HealthController
    // return request(app.getHttpServer())
    //   .get('/api/v1')
    //   .expect(200)
    //   .expect('Hello World!'); // Or whatever your root endpoint returns
    expect(true).toBe(true); // Placeholder if no root endpoint
  });

  // Example Product E2E Test
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
        .then((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toEqual(productPayload.name);
          productId = res.body.id;
        });
    });

    it('(GET) /products - should get all products', () => {
      return request(app.getHttpServer())
        .get('/api/v1/products')
        .expect(200)
        .then((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThanOrEqual(1);
        });
    });

    it('(GET) /products/:id - should get a specific product', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/products/${productId}`)
        .expect(200)
        .then((res) => {
          expect(res.body.id).toEqual(productId);
          expect(res.body.name).toEqual(productPayload.name);
        });
    });
  });

  // Example Review E2E Test (assuming a product exists)
  describe('/reviews', () => {
    let createdProductId: string; // Will be set by creating a product first
    const reviewPayload = {
      // productId will be set dynamically
      userId: 'e2e-user-123',
      rating: 5,
      comment: 'Excellent product from E2E test!',
    };

    beforeAll(async () => {
      // Create a product to review
      const productRes = await request(app.getHttpServer())
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
        .then((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.productId).toEqual(createdProductId);
          expect(res.body.comment).toEqual(reviewPayload.comment);
        });
    });

    it('(GET) /reviews?productId=:id - should get reviews for a product', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/reviews?productId=${createdProductId}`)
        .expect(200)
        .then((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThanOrEqual(1);
          expect(res.body[0].productId).toEqual(createdProductId);
        });
    });

    it('(GET) /reviews/average-rating/:productId - should get average rating for a product', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/reviews/average-rating/${createdProductId}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('productId', createdProductId);
          expect(res.body).toHaveProperty('averageRating');
          expect(typeof res.body.averageRating).toBe('number');
        });
    });
  });

  afterAll(async () => {
    // Optional: Clean up database entries created during tests
    // This might involve direct DB access or specific cleanup endpoints if you build them.
    // For mongodb-memory-server, it usually cleans itself up.
    await app.close();
  });
});
