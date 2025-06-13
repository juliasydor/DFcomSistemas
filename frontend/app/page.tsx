import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Star,
  Package,
  TrendingUp,
  Users,
  ShoppingCart,
  Zap,
  Rocket,
  Globe,
  Shield,
} from "lucide-react";
import { ProductList } from "@/components/product-list";
import "./globals.css";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Package className="h-10 w-10 text-purple-400" />
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  TechReviews
                </h1>
                <p className="text-xs text-purple-300">
                  Next-Gen Product Platform
                </p>
              </div>
            </div>
            <Link href="/products/create">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
                <Rocket className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Welcome to the Future
            </h2>
            <div className="absolute -top-2 -right-2">
              <Zap className="h-8 w-8 text-yellow-400 animate-bounce" />
            </div>
          </div>
          <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
            Discover cutting-edge products and share your experiences with our
            global tech community
          </p>
          <div className="flex items-center justify-center space-x-6 text-purple-300">
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Global Platform</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Trusted Reviews</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Real-time Analytics</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500/20 backdrop-blur-sm hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">
                Total Products
              </CardTitle>
              <div className="relative">
                <Package className="h-6 w-6 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-purple-400/20 rounded-full animate-ping group-hover:animate-pulse" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-1">150+</div>
              <p className="text-xs text-purple-300 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                Products available for review
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border-blue-500/20 backdrop-blur-sm hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-200">
                Community Reviews
              </CardTitle>
              <div className="relative">
                <Star className="h-6 w-6 text-yellow-400 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-yellow-400/20 rounded-full animate-ping group-hover:animate-pulse" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-1">2,500+</div>
              <p className="text-xs text-blue-300 flex items-center">
                <Users className="h-3 w-3 mr-1" />
                Customer reviews and ratings
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-500/20 backdrop-blur-sm hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-200">
                Average Rating
              </CardTitle>
              <div className="relative">
                <Star className="h-6 w-6 text-green-400 group-hover:scale-110 transition-transform duration-300 fill-current" />
                <div className="absolute inset-0 bg-green-400/20 rounded-full animate-ping group-hover:animate-pulse" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-1">4.2</div>
              <p className="text-xs text-green-300 flex items-center">
                <ShoppingCart className="h-3 w-3 mr-1" />
                Out of 5 stars
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Product List */}
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-purple-500/20 p-8">
          <ProductList />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 bg-black/20 backdrop-blur-xl mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-purple-300">
            <p className="flex items-center justify-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>Created by Julia Sydor</span>
              <Rocket className="h-4 w-4" />
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
