"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Star,
  Loader2,
  Zap,
  TrendingUp,
  Users,
  MessageSquare,
  Calendar,
  Edit,
  Trash2,
} from "lucide-react";
import { productService, reviewService, Product } from "@/lib/api";
import { ReviewForm } from "@/components/review-form";
import { ReviewList } from "@/components/review-list";
import { EditProductModal } from "@/components/edit-product-modal";
import { DeleteConfirmModal } from "@/components/delete-confirm-modal";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

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
        setError(err instanceof Error ? err.message : "Failed to load product");
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId, refreshReviews]);

  const handleReviewCreated = () => {
    setRefreshReviews((prev) => prev + 1);
  };

  const handleProductUpdated = (updatedProduct: Product) => {
    setProduct(updatedProduct);
    setShowEditModal(false);
    toast.success("Product updated successfully! ✨");
  };

  const handleDeleteProduct = async () => {
    try {
      setDeleting(true);
      await productService.delete(productId);
      toast.success("Product deleted successfully! 🗑️");
      router.push("/");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete product"
      );
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <Loader2 className="h-16 w-16 animate-spin text-purple-400" />
              <div className="absolute inset-0 h-16 w-16 animate-ping rounded-full bg-purple-400/20" />
            </div>
            <span className="mt-6 text-purple-200 flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Loading product details...</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="border-purple-500/50 text-purple-200 hover:bg-purple-500/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Catalog
              </Button>
            </Link>
          </div>
          <div className="text-center py-20">
            <div className="bg-red-900/20 border border-red-500/20 rounded-xl p-8 max-w-md mx-auto">
              <Zap className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-300 mb-4">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <p className="text-purple-200 mb-4">Product not found</p>
            <Link href="/">
              <Button
                variant="outline"
                className="border-purple-500/50 text-purple-200 hover:bg-purple-500/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Catalog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/">
            <Button
              variant="outline"
              size="sm"
              className="border-purple-500/50 text-purple-200 hover:bg-purple-500/10 backdrop-blur-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Catalog
            </Button>
          </Link>

          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setShowEditModal(true)}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Product
            </Button>
            <Button
              onClick={() => setShowDeleteModal(true)}
              variant="destructive"
              className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Product
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div>
            {product.imageUrl ? (
              <div className="relative w-full h-96 rounded-2xl overflow-hidden group">
                <Image
                  src={product.imageUrl || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            ) : (
              <div className="w-full h-96 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center"></div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {product.name}
              </h1>

              <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                {product.description}
              </p>

              <div className="text-4xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                ${product.price}
              </div>

              <div className="flex items-center space-x-4 text-sm text-slate-400">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Added {new Date(product.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {averageRating && (
              <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center space-x-2">
                    <Users className="h-5 w-5 text-purple-400" />
                    <span>Community Reviews</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-6 w-6 ${
                              star <= averageRating.averageRating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-slate-600"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-2xl font-semibold text-white">
                        {averageRating.averageRating > 0
                          ? averageRating.averageRating.toFixed(1)
                          : "New"}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 text-slate-300">
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{averageRating.totalReviews} reviews</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>Trending</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <Separator className="my-12 bg-purple-500/20" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-purple-500/20 p-8">
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center space-x-2">
              <MessageSquare className="h-6 w-6 text-purple-400" />
              <span>Write a Review</span>
            </h2>
            <ReviewForm
              productId={productId}
              onReviewCreated={handleReviewCreated}
            />
          </div>

          <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-purple-500/20 p-8">
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center space-x-2">
              <Users className="h-6 w-6 text-purple-400" />
              <span>Community Feedback</span>
            </h2>
            <ReviewList
              productId={productId}
              key={refreshReviews}
              onReviewUpdated={handleReviewCreated}
            />
          </div>
        </div>
      </div>

      {/* Edit Product Modal */}
      {showEditModal && (
        <EditProductModal
          product={product}
          onClose={() => setShowEditModal(false)}
          onProductUpdated={handleProductUpdated}
        />
      )}

      {/* Delete Product Modal */}
      {showDeleteModal && (
        <DeleteConfirmModal
          title="Delete Product"
          description={`Are you sure you want to delete "${product.name}"? This action cannot be undone and will also delete all reviews for this product.`}
          onConfirm={handleDeleteProduct}
          onCancel={() => setShowDeleteModal(false)}
          loading={deleting}
        />
      )}
    </div>
  );
}
