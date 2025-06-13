"use client";

import { useEffect, useState } from "react";
import { Product, productService } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Package, AlertCircle, RefreshCw, ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(
        err instanceof Error ? err.message : "Erro ao carregar produtos"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Package className="h-16 w-16 text-purple-400 animate-pulse mx-auto mb-4" />
          <p className="text-purple-300 text-lg">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-400 mb-2">
            Erro ao carregar produtos
          </h3>
          <p className="text-gray-300 mb-4">{error}</p>
          <div className="space-y-2">
            <Button
              onClick={fetchProducts}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Button>
            <p className="text-sm text-gray-400 mt-2">
              Certifique-se de que o servidor backend está rodando
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            Nenhum produto encontrado
          </h3>
          <p className="text-gray-400 mb-4">
            Comece adicionando seu primeiro produto!
          </p>
          <Link href="/products/create">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              Adicionar Produto
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Produtos Disponíveis</h2>
        <Button
          onClick={fetchProducts}
          variant="outline"
          size="sm"
          className="text-purple-300 border-purple-500/50 hover:bg-purple-500/10"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`}>
            <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/20 backdrop-blur-sm hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer group">
              <div className="relative w-full h-48 overflow-hidden">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800/50">
                    <ImageIcon className="h-12 w-12 text-slate-600" />
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                  {product.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-purple-400">
                    R$ {product.price.toFixed(2)}
                  </span>
                  <div className="flex items-center space-x-1 text-yellow-400">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm">4.5</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-gray-400">
                    Estoque: {product.stock}
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
