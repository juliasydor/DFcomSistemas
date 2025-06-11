"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Star, Loader2 } from "lucide-react";
import { productService, reviewService } from "@/lib/api";
import { ReviewForm } from "@/components/review-form";
import { ReviewList } from "@/components/review-list";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

interface AverageRating {
  productId: string;
  averageRating: number;
  totalReviews: number;
}

interface ProductDetailProps {
  productId: string;
}

export function ProductDetail({ productId }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [averageRating, setAverageRating] = useState<AverageRating | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshReviews, setRefreshReviews] = useState(0);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);

        const [productData, ratingData] = await Promise.all([
          productService.getById(productId),
          reviewService.getAverageRating(productId),
        ]);

        setProduct(productData);
        setAverageRating(ratingData);
      } catch (err: unknown) {
        const error = err as Error;
        setError(error.message || "Failed to load product");
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId, refreshReviews]);

  const handleReviewCreated = () => {
    setRefreshReviews((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading product...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-destructive mb-4">{error}</p>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Product not found</p>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div>
          <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
            <span className="text-muted-foreground">No image available</span>
          </div>
        </div>

        <div>
          <div className="mb-4">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <Badge variant="secondary" className="mb-4">
              Stock: {product.stock}
            </Badge>
            <p className="text-muted-foreground mb-4">{product.description}</p>
            <div className="text-3xl font-bold mb-4">${product.price}</div>
          </div>

          {averageRating && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Customer Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= averageRating.averageRating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold">
                    {averageRating.averageRating > 0
                      ? averageRating.averageRating.toFixed(1)
                      : "No ratings"}
                  </span>
                  <span className="text-muted-foreground">
                    ({averageRating.totalReviews} reviews)
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Separator className="my-8" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-6">Write a Review</h2>
          <ReviewForm
            productId={productId}
            onReviewCreated={handleReviewCreated}
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          <ReviewList productId={productId} key={refreshReviews} />
        </div>
      </div>
    </div>
  );
}
