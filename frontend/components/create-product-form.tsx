"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import {
  Package,
  DollarSign,
  Tag,
  ImageIcon,
  FileText,
  Rocket,
  Zap,
} from "lucide-react";
import { productService } from "@/lib/api";
import { toast } from "sonner";

export function CreateProductForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    stock: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.price ||
      formData.stock === ""
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const price = Number.parseFloat(formData.price);
    const stock = Number.parseInt(formData.stock, 10);
    if (isNaN(price) || price < 0) {
      toast.error("Please enter a valid price");
      return;
    }
    if (isNaN(stock) || stock < 0) {
      toast.error("Please enter a valid stock (0 or more)");
      return;
    }

    try {
      setLoading(true);
      const product = await productService.create({
        name: formData.name.trim(),
        description: formData.description.trim(),
        price,
        imageUrl: formData.imageUrl.trim() || undefined,
        stock,
      });

      toast.success("Product launched successfully! 🚀");
      router.push(`/products/${product.id}`);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Rocket className="h-6 w-6 text-purple-400" />
            <span>Launch New Product</span>
          </CardTitle>
          <CardDescription className="text-slate-300">
            Add your innovative product to our tech catalog and get community
            feedback
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label
                htmlFor="name"
                className="text-white flex items-center space-x-2 mb-2"
              >
                <Package className="h-4 w-4 text-purple-400" />
                <span>Product Name *</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter an innovative product name"
                required
                className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-purple-500/50"
              />
            </div>

            <div>
              <Label
                htmlFor="description"
                className="text-white flex items-center space-x-2 mb-2"
              >
                <FileText className="h-4 w-4 text-purple-400" />
                <span>Description *</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your product's features and benefits..."
                rows={4}
                required
                className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-purple-500/50 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label
                  htmlFor="price"
                  className="text-white flex items-center space-x-2 mb-2"
                >
                  <DollarSign className="h-4 w-4 text-green-400" />
                  <span>Price *</span>
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                  className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-purple-500/50"
                />
              </div>

              <div>
                <Label
                  htmlFor="stock"
                  className="text-white flex items-center space-x-2 mb-2"
                >
                  <Tag className="h-4 w-4 text-yellow-400" />
                  <span>Stock *</span>
                </Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  required
                  className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-purple-500/50"
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="imageUrl"
                className="text-white flex items-center space-x-2 mb-2"
              >
                <ImageIcon className="h-4 w-4 text-pink-400" />
                <span>Image URL (optional)</span>
              </Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/product-image.jpg"
                className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-purple-500/50"
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
                  <span>Launching...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Rocket className="h-4 w-4" />
                  <span>Launch Product</span>
                  <Zap className="h-4 w-4" />
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
