const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// Product Types
interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  createdAt: string
  updatedAt: string
}

interface CreateProductDto {
  name: string
  description: string
  price: number
  stock: number
}

// Review Types
interface Review {
  id: string
  productId: string
  userId: string
  rating: number
  comment: string
  createdAt: string
  updatedAt: string
}

interface CreateReviewDto {
  productId: string
  userId: string
  rating: number
  comment: string
}

interface AverageRating {
  productId: string
  averageRating: number
}

// Error Response
interface ErrorResponse {
  statusCode: number
  message: string | string[]
  error: string
}

// API Helper function
async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const url = `${API_URL}${endpoint}`;
    console.log('Making request to:', url); // Debug log

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options?.headers,
      },
      credentials: 'include',
      ...options,
    });

    if (!response.ok) {
      const error: ErrorResponse = await response.json();
      const message = Array.isArray(error.message) ? error.message.join(', ') : error.message;
      throw new Error(message);
    }

    return response.json();
  } catch (error) {
    console.error('API Request Error:', error); // Debug log
    throw error;
  }
}

// Product Service
export const productService = {
  // Create a new product
  create: async (productData: CreateProductDto): Promise<Product> => {
    return apiRequest<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  // Get all products
  getAll: async (): Promise<Product[]> => {
    return apiRequest<Product[]>('/products');
  },

  // Get product by ID
  getById: async (id: string): Promise<Product> => {
    return apiRequest<Product>(`/products/${id}`);
  },
};

// Review Service
export const reviewService = {
  // Create a new review
  create: async (reviewData: CreateReviewDto): Promise<Review> => {
    return apiRequest<Review>('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  },

  // Get all reviews for a product
  getByProductId: async (productId: string): Promise<Review[]> => {
    return apiRequest<Review[]>(`/reviews?productId=${productId}`);
  },

  // Get average rating for a product
  getAverageRating: async (productId: string): Promise<AverageRating> => {
    return apiRequest<AverageRating>(`/reviews/average-rating/${productId}`);
  },
};
