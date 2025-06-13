const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1"

export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

interface CreateProductDto {
  name: string
  description: string
  price: number
  imageUrl?: string
  stock: number
}

interface UpdateProductDto {
  name?: string
  description?: string
  price?: number
  category?: string
  imageUrl?: string
}

export interface Review {
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

interface UpdateReviewDto {
  rating?: number
  comment?: string
}

interface AverageRating {
  productId: string
  averageRating: number
  totalReviews: number
}

interface ErrorResponse {
  statusCode: number
  message: string | string[]
  error: string
}

async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  console.log("🔗 Making request to:", url)

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    })

    console.log("📡 Response status:", response.status) 

    if (!response.ok) {
      const responseText = await response.text()
      console.log("❌ Error response:", responseText) 

      try {
        const error: ErrorResponse = JSON.parse(responseText)
        const message = Array.isArray(error.message) ? error.message.join(", ") : error.message
        throw new Error(message)
      } catch {
        throw new Error(`HTTP ${response.status}: ${responseText}`)
      }
    }

    const responseText = await response.text()
    if (!responseText) {
      return {} as T
    }

    console.log("✅ Success response:", responseText)
    return JSON.parse(responseText)
  } catch (error) {
    console.error("🚨 API Request failed:", error)
    throw error
  }
}

export const productService = {
  create: async (productData: CreateProductDto): Promise<Product> => {
    return apiRequest<Product>("/products", {
      method: "POST",
      body: JSON.stringify(productData),
    })
  },

  getAll: async (): Promise<Product[]> => {
    return apiRequest<Product[]>("/products")
  },

  getById: async (id: string): Promise<Product> => {
    return apiRequest<Product>(`/products/${id}`)
  },

  update: async (id: string, productData: UpdateProductDto): Promise<Product> => {
    return apiRequest<Product>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    })
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest<void>(`/products/${id}`, {
      method: "DELETE",
    })
  },
}

export const reviewService = {
  create: async (reviewData: CreateReviewDto): Promise<Review> => {
    return apiRequest<Review>("/reviews", {
      method: "POST",
      body: JSON.stringify(reviewData),
    })
  },

  getByProductId: async (productId: string): Promise<Review[]> => {
    return apiRequest<Review[]>(`/reviews?productId=${productId}`)
  },

  getByProductIdAlt: async (productId: string): Promise<Review[]> => {
    return apiRequest<Review[]>(`/reviews/product/${productId}`)
  },

  getAverageRating: async (productId: string): Promise<AverageRating> => {
    return apiRequest<AverageRating>(`/reviews/product/${productId}/average`)
  },

  getAverageRatingAlt: async (productId: string): Promise<AverageRating> => {
    return apiRequest<AverageRating>(`/reviews/product/${productId}/average`)
  },

  update: async (id: string, reviewData: UpdateReviewDto): Promise<Review> => {
    return apiRequest<Review>(`/reviews/${id}`, {
      method: "PUT",
      body: JSON.stringify(reviewData),
    })
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest<void>(`/reviews/${id}`, {
      method: "DELETE",
    })
  },
}
