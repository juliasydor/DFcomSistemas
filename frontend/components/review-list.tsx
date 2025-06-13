"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Star,
  Loader2,
  User,
  Calendar,
  MessageSquare,
  Zap,
  Edit,
  Trash2,
} from "lucide-react";
import { reviewService } from "@/lib/api";
import { EditReviewModal } from "@/components/edit-review-modal";
import { DeleteConfirmModal } from "@/components/delete-confirm-modal";
import { toast } from "sonner";

interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

interface ReviewListProps {
  productId: string;
  onReviewUpdated?: () => void;
}

export function ReviewList({ productId, onReviewUpdated }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [deletingReview, setDeletingReview] = useState<Review | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const reviewsData = await reviewService.getByProductId(productId);
        setReviews(reviewsData);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  const handleReviewUpdated = (updatedReview: Review) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === updatedReview.id ? updatedReview : review
      )
    );
    setEditingReview(null);
    onReviewUpdated?.();
    toast.success("Review updated successfully! ✨");
  };

  const handleDeleteReview = async () => {
    if (!deletingReview) return;

    try {
      setDeleteLoading(true);
      await reviewService.delete(deletingReview.id);
      setReviews((prev) =>
        prev.filter((review) => review.id !== deletingReview.id)
      );
      toast.success("Review deleted successfully! 🗑️");
      onReviewUpdated?.();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setDeleteLoading(false);
      setDeletingReview(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="relative">
          <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
          <div className="absolute inset-0 h-8 w-8 animate-ping rounded-full bg-purple-400/20" />
        </div>
        <span className="mt-4 text-purple-200 flex items-center space-x-2">
          <MessageSquare className="h-4 w-4" />
          <span>Loading community feedback...</span>
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-900/20 border border-red-500/20 rounded-xl p-6">
          <Zap className="h-8 w-8 text-red-400 mx-auto mb-2" />
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-purple-900/20 border border-purple-500/20 rounded-xl p-8">
          <MessageSquare className="h-12 w-12 text-purple-400 mx-auto mb-4" />
          <p className="text-purple-200 mb-2">No reviews yet!</p>
          <p className="text-sm text-purple-300">
            Be the first to share your experience with this product.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
        {reviews.map((review) => (
          <Card
            key={review.id}
            className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 border-slate-700/50 backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <span className="font-semibold text-white">
                      {review.userId}
                    </span>
                    <div className="flex items-center space-x-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3 w-3 ${
                            star <= review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-slate-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 text-xs text-slate-400">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingReview(review)}
                      className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDeletingReview(review)}
                      className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 text-sm leading-relaxed">
                {review.comment}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Review Modal */}
      {editingReview && (
        <EditReviewModal
          review={editingReview}
          onClose={() => setEditingReview(null)}
          onReviewUpdated={handleReviewUpdated}
        />
      )}

      {/* Delete Review Modal */}
      {deletingReview && (
        <DeleteConfirmModal
          title="Delete Review"
          description={`Are you sure you want to delete this review? This action cannot be undone.`}
          onConfirm={handleDeleteReview}
          onCancel={() => setDeletingReview(null)}
          loading={deleteLoading}
        />
      )}
    </>
  );
}
