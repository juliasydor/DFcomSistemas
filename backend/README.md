# Product Review System API

This project implements a Product Review System using NestJS, following Hexagonal Architecture (Ports and Adapters), SOLID principles, and DRY. It provides a RESTful API for managing products and their reviews.

## Table of Contents

- [Product Review System API](#product-review-system-api)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Architecture](#architecture)
  - [Folder Structure](#folder-structure)
  - [Prerequisites](#prerequisites)
  - [Setup and Installation](#setup-and-installation)
  - [Running the Application](#running-the-application)
    - [Development Mode](#development-mode)
    - [Production Mode](#production-mode)
  - [Running Tests](#running-tests)
    - [Unit Tests](#unit-tests)
    - [E2E Tests](#e2e-tests)
  - [API Endpoints](#api-endpoints)
    - [Products API](#products-api)
      - [`POST /products`](#post-products)
      - [`GET /products`](#get-products)
      - [`GET /products/:id`](#get-productsid)
    - [Reviews API](#reviews-api)
      - [`POST /reviews`](#post-reviews)
      - [`GET /reviews?productId=:productId`](#get-reviewsproductidproductid)
      - [`GET /reviews/average-rating/:productId`](#get-reviewsaverage-ratingproductid)
  - [Environment Variables](#environment-variables)

## Features

- CRUD operations for Products.
- Create and list Reviews for Products.
- Calculate average rating for Products.
- Request logging.
- Basic authentication guard structure (can be extended).
- Input validation using DTOs and `class-validator`.

## Architecture

The project follows the Hexagonal Architecture pattern:

- **Domain**: Contains core business logic, entities, and repository interfaces (ports). It has no dependencies on other layers.
  - `domain/products/entities/product.entity.ts`
  - `domain/reviews/entities/review.entity.ts`
  - `domain/products/repositories/product.repository.ts`
  - `domain/reviews/repositories/review.repository.ts`
- **Application**: Contains use cases that orchestrate the flow of data between the domain and the infrastructure.
  - `application/use-cases/`
- **Infrastructure**: Implements adapters for external concerns like databases, external APIs, etc. This includes repository implementations.
  - `infrastructure/database/` (Mongoose schemas, connection)
  - `infrastructure/repositories/` (MongoDB repository implementations)
- **Interfaces**: Exposes the application to the outside world (e.g., REST controllers, CLI).
  - `interfaces/controllers/`
  - `interfaces/middleware/`
  - `interfaces/guards/`
- **Shared**: Contains DTOs, utilities, and other shared code.
  - `shared/dtos/`
  - `shared/utils/`
- **Modules**: NestJS modules wiring everything together.
  - `modules/`

## Folder Structure

```
product-review-system/
├── src/
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   ├── interfaces/
│   ├── shared/
│   ├── modules/
│   └── main.ts
├── test/
│   ├── unit/
│   └── e2e/
├── .env.example
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

(For detailed structure, refer to the initial request.)

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- MongoDB instance (running locally or accessible via URI)

## Setup and Installation

1.  **Clone the repository (if applicable) or extract the provided files.**

2.  **Navigate to the project directory:**

    ```bash
    cd product-review-system
    ```

3.  **Install dependencies:**

    ```bash
    npm install
    # or
    # yarn install
    ```

4.  **Set up environment variables:**
    Create a `.env.development` file in the root directory by copying `.env.example`:
    ```bash
    cp .env.example .env.development
    ```
    Edit `.env.development` and update the `MONGO_URI` with your MongoDB connection string.
    Example:
    ```env
    NODE_ENV=development
    PORT=3000
    MONGO_URI=mongodb://localhost:27017/product_review_system_dev
    ```
    For tests, you might want a `.env.test` file:
    ```bash
    cp .env.example .env.test
    ```
    And update `MONGO_URI` to a test database, e.g., `mongodb://localhost:27017/product_review_system_test`.
    Alternatively, for tests, `mongodb-memory-server` can be configured (current setup uses it for some Jest examples).

## Running the Application

### Development Mode

This mode enables hot-reloading.

```bash
npm run start:dev
```

The application will be available at `http://localhost:PORT/api/v1` (default PORT is 3000).

### Production Mode

First, build the application:

```bash
npm run build
```

Then, start the application:

```bash
npm run start:prod
```

## Running Tests

### Unit Tests

```bash
npm run test
```

To run with coverage:

```bash
npm run test:cov
```

### E2E Tests

Ensure your test database is configured and accessible (if not using an in-memory solution for E2E).

```bash
npm run test:e2e
```

## API Endpoints

All endpoints are prefixed with `/api/v1`.

### Products API

#### `POST /products`

Create a new product.

- **Request Body:** `CreateProductDto`
  ```json
  {
    "name": "Awesome Laptop",
    "description": "A very powerful and sleek laptop.",
    "price": 1299.99,
    "stock": 50
  }
  ```
- **Response:** `201 Created` - `ProductResponseDto`
  ```json
  {
    "id": "d9f8c7b6-a5e4-4d3c-2b1a-0f9e8d7c6b5a",
    "name": "Awesome Laptop",
    "description": "A very powerful and sleek laptop.",
    "price": 1299.99,
    "stock": 50,
    "createdAt": "2023-10-27T10:00:00.000Z",
    "updatedAt": "2023-10-27T10:00:00.000Z"
  }
  ```
- **Validation Errors:** `400 Bad Request` if DTO validation fails.

#### `GET /products`

List all products.

- **Response:** `200 OK` - Array of `ProductResponseDto`
  ```json
  [
    {
      "id": "d9f8c7b6-a5e4-4d3c-2b1a-0f9e8d7c6b5a",
      "name": "Awesome Laptop",
      "description": "A very powerful and sleek laptop.",
      "price": 1299.99,
      "stock": 50,
      "createdAt": "2023-10-27T10:00:00.000Z",
      "updatedAt": "2023-10-27T10:00:00.000Z"
    }
  ]
  ```

#### `GET /products/:id`

Get a specific product by its ID.

- **Path Parameter:** `id` (UUID string)
- **Response:** `200 OK` - `ProductResponseDto`
- **Errors:** `404 Not Found` if product with the given ID doesn't exist. `400 Bad Request` if ID is not a valid UUID.

### Reviews API

#### `POST /reviews`

Create a new review for a product.

- **Request Body:** `CreateReviewDto`
  ```json
  {
    "productId": "d9f8c7b6-a5e4-4d3c-2b1a-0f9e8d7c6b5a",
    "userId": "user-abc-123",
    "rating": 5,
    "comment": "This laptop is amazing! Highly recommended."
  }
  ```
- **Response:** `201 Created` - `ReviewResponseDto`
  ```json
  {
    "id": "c3b2a1f0-e9d8-7c6b-5a4f-3e2d1c0b9a8f",
    "productId": "d9f8c7b6-a5e4-4d3c-2b1a-0f9e8d7c6b5a",
    "userId": "user-abc-123",
    "rating": 5,
    "comment": "This laptop is amazing! Highly recommended.",
    "createdAt": "2023-10-27T11:00:00.000Z",
    "updatedAt": "2023-10-27T11:00:00.000Z"
  }
  ```
- **Validation Errors:** `400 Bad Request` if DTO validation fails.
- **Errors:** `404 Not Found` if the `productId` does not exist.

#### `GET /reviews?productId=:productId`

List all reviews for a specific product.

- **Query Parameter:** `productId` (UUID string) - _Required_
- **Response:** `200 OK` - Array of `ReviewResponseDto`
  ```json
  [
    {
      "id": "c3b2a1f0-e9d8-7c6b-5a4f-3e2d1c0b9a8f",
      "productId": "d9f8c7b6-a5e4-4d3c-2b1a-0f9e8d7c6b5a",
      "userId": "user-abc-123",
      "rating": 5,
      "comment": "This laptop is amazing! Highly recommended.",
      "createdAt": "2023-10-27T11:00:00.000Z",
      "updatedAt": "2023-10-27T11:00:00.000Z"
    }
  ]
  ```
- **Errors:** `400 Bad Request` if `productId` is missing or not a valid UUID.

#### `GET /reviews/average-rating/:productId`

Get the average rating for a specific product.

- **Path Parameter:** `productId` (UUID string)
- **Response:** `200 OK`
  ```json
  {
    "productId": "d9f8c7b6-a5e4-4d3c-2b1a-0f9e8d7c6b5a",
    "averageRating": 4.75
  }
  ```
- **Errors:** `400 Bad Request` if `productId` is not a valid UUID. (Note: Will return `0` average rating if product exists but has no reviews).

## Environment Variables

The application uses the following environment variables (configure in `.env.{NODE_ENV}` files):

- `NODE_ENV`: The application environment (e.g., `development`, `production`, `test`).
- `PORT`: The port on which the application will listen (default: `3000`).
- `MONGO_URI`: The connection string for your MongoDB database.

  Example for `.env.development`:

  ```
  NODE_ENV=development
  PORT=3000
  MONGO_URI=mongodb://localhost:27017/product_review_system_dev
  ```

  Example for `.env.test` (if using a separate test DB):

  ```
  NODE_ENV=test
  PORT=3001 # Optional, can be different for tests
  MONGO_URI=mongodb://localhost:27017/product_review_system_test
  ```

(Note: The `AuthGuard` is currently a placeholder. For real authentication, you would integrate a strategy like JWT and protect routes accordingly. The `x-api-key` in the example guard is for demonstration.)
