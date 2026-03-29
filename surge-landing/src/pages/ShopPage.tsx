import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import * as api from "@/lib/api";
import { ShoppingCart, Loader2, Package } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  protein: number;
  stock: number;
  imageUrl: string;
  category: string;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.getProducts();
        setProducts(Array.isArray(data) ? data : data.products || []);
      } catch {
        toast({ title: "Failed to load products", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleAddToCart = async (product: Product) => {
    if (!isAuthenticated) {
      toast({ title: "Please login first", description: "You need an account to add items to cart.", variant: "destructive" });
      return;
    }
    setAddingId(product._id);
    try {
      await addToCart(product._id, 1);
      toast({ title: "Added to cart!", description: `${product.name} has been added.` });
    } catch (err: any) {
      toast({ title: "Couldn't add to cart", description: err.message, variant: "destructive" });
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-display font-black text-white mb-4">
              Shop <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-400">SURGE</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Premium plant-powered protein snacks. Pick your fuel.
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {/* Products Grid */}
          {!loading && products.length === 0 && (
            <div className="text-center py-20">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No products available yet.</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
              >
                {/* Image */}
                <div className="aspect-square bg-black/30 p-6 flex items-center justify-center overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Info */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display font-bold text-white text-sm leading-tight">
                      {product.name}
                    </h3>
                    <span className="text-primary font-bold text-lg whitespace-nowrap">₹{product.price}</span>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                      {product.protein}g protein
                    </span>
                    {product.stock > 0 ? (
                      <span className="text-emerald-400">In stock</span>
                    ) : (
                      <span className="text-red-400">Out of stock</span>
                    )}
                  </div>

                  <Button
                    className="w-full mt-2"
                    disabled={product.stock === 0 || addingId === product._id}
                    onClick={() => handleAddToCart(product)}
                  >
                    {addingId === product._id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
