"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Loader2 } from "lucide-react";
import { productService, reviewService } from "@/lib/api";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

interface ProductWithRating extends Product {
  averageRating: number;
}

export function ProductList() {
  const [products, setProducts] = useState<ProductWithRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Starting to fetch products..."); // Debug log
        setLoading(true);
        const productsData = await productService.getAll();
        console.log("Products fetched:", productsData); // Debug log

        // Fetch ratings for each product
        const productsWithRatings = await Promise.all(
          productsData.map(async (product: Product) => {
            try {
              const rating = await reviewService.getAverageRating(product.id);
              return {
                ...product,
                averageRating: rating.averageRating,
              };
            } catch (error) {
              console.error(
                `Error fetching rating for product ${product.id}:`,
                error
              );
              return {
                ...product,
                averageRating: 0,
              };
            }
          })
        );

        console.log("Products with ratings:", productsWithRatings); // Debug log
        setProducts(productsWithRatings);
      } catch (err) {
        console.error("Error in fetchProducts:", err); // Debug log
        setError(
          err instanceof Error ? err.message : "Failed to load products"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading products...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-primary hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No products found.</p>
        <Link href="/products/create" className="text-primary hover:underline">
          Create the first product
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">All Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="line-clamp-2">{product.name}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {product.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold">${product.price}</span>
                  <Badge variant="secondary">Stock: {product.stock}</Badge>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">
                    {product.averageRating > 0
                      ? product.averageRating.toFixed(1)
                      : "No ratings"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
