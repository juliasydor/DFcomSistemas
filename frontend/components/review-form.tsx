"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, User, MessageSquare, Send, Zap } from "lucide-react";
import { reviewService } from "@/lib/api";
import { toast } from "sonner";

interface ReviewFormProps {
  productId: string;
  onReviewCreated: () => void;
}

export function ReviewForm({ productId, onReviewCreated }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId.trim()) {
      toast.error("Please enter your user ID");
      return;
    }

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
      await reviewService.create({
        productId,
        userId: userId.trim(),
        rating,
        comment: comment.trim(),
      });

      toast.success("Review submitted successfully! 🎉");

      // Reset form
      setRating(0);
      setComment("");
      setUserId("");
      onReviewCreated();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 border-slate-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <MessageSquare className="h-5 w-5 text-purple-400" />
          <span>Share Your Experience</span>
        </CardTitle>
        <CardDescription className="text-slate-300">
          Help the community by sharing your honest thoughts about this product
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label
              htmlFor="userId"
              className="text-white flex items-center space-x-2 mb-2"
            >
              <User className="h-4 w-4 text-purple-400" />
              <span>User ID</span>
            </Label>
            <Input
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter your unique user ID"
              required
              className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-purple-500/50"
            />
          </div>

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
                  aria-label={`Rate ${star} out of 5 stars`}
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
                <div className="ml-4 flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-purple-300 font-medium">
                    {rating} out of 5 stars
                  </span>
                </div>
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
              placeholder="Share your detailed thoughts about this product..."
              rows={4}
              required
              className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-purple-500/50 resize-none"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Submitting...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Send className="h-4 w-4" />
                <span>Submit Review</span>
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
