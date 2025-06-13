"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, MessageSquare, Save, X } from "lucide-react";
import { reviewService } from "@/lib/api";
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

interface EditReviewModalProps {
  review: Review;
  onClose: () => void;
  onReviewUpdated: (review: Review) => void;
}

export function EditReviewModal({
  review,
  onClose,
  onReviewUpdated,
}: EditReviewModalProps) {
  const [rating, setRating] = useState(review.rating);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState(review.comment);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    try {
      setLoading(true);
      const updatedReview = await reviewService.update(review.id, {
        rating,
        comment: comment.trim(),
      });

      onReviewUpdated(updatedReview);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update review"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <MessageSquare className="h-6 w-6 text-purple-400" />
            <span>Edit Review</span>
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="text-white flex items-center space-x-2 mb-3">
              <Star className="h-4 w-4 text-purple-400" />
              <span>Rating</span>
            </Label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  aria-label={`Rating star ${star}`}
                  className="focus:outline-none transition-transform duration-200 hover:scale-110"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`h-8 w-8 transition-colors duration-200 ${
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-slate-600 hover:text-slate-500"
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-4 text-sm text-purple-300 font-medium">
                  {rating} out of 5 stars
                </span>
              )}
            </div>
          </div>

          <div>
            <Label
              htmlFor="comment"
              className="text-white flex items-center space-x-2 mb-2"
            >
              <MessageSquare className="h-4 w-4 text-purple-400" />
              <span>Your Review</span>
            </Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your updated thoughts..."
              rows={4}
              required
              className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-purple-500/50 resize-none"
            />
          </div>

          <div className="flex items-center space-x-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Updating...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Save className="h-4 w-4" />
                  <span>Update Review</span>
                </div>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
