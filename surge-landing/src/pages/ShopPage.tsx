import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import * as api from "@/lib/api";
import { ShoppingCart, Loader2, Package, Eye, Leaf, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
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

          <motion.div
            initial="hidden"
            animate={!loading ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 1 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.08 },
              },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {products.map((product) => (
              <motion.div
                key={product._id}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
                }}
                className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
              >
                {/* Image */}
                <div className="aspect-square bg-black/30 p-6 flex items-center justify-center overflow-hidden relative">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    type="button"
                    onClick={() => setQuickViewProduct(product)}
                    aria-label={`Quick view ${product.name}`}
                    className="absolute right-4 top-4 inline-flex h-10 w-10 translate-y-2 items-center justify-center rounded-full border border-white/10 bg-black/70 text-white opacity-0 shadow-lg backdrop-blur transition-all duration-300 hover:border-primary/60 hover:text-primary group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
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
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>
      <ProductQuickView
        product={quickViewProduct}
        open={!!quickViewProduct}
        adding={addingId === quickViewProduct?._id}
        onOpenChange={(open) => {
          if (!open) setQuickViewProduct(null);
        }}
        onAddToCart={handleAddToCart}
      />
      <Footer />
    </div>
  );
}

function ProductQuickView({
  product,
  open,
  adding,
  onOpenChange,
  onAddToCart,
}: {
  product: Product | null;
  open: boolean;
  adding: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToCart: (product: Product) => void;
}) {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] max-w-4xl overflow-y-auto p-0">
        <div className="grid gap-0 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="flex min-h-[320px] items-center justify-center bg-black/40 p-8">
            <motion.img
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              src={product.imageUrl}
              alt={product.name}
              className="max-h-[360px] w-full object-contain"
            />
          </div>

          <div className="space-y-6 p-6 sm:p-8">
            <DialogHeader>
              <DialogTitle className="pr-8 text-3xl">{product.name}</DialogTitle>
              <DialogDescription className="text-base leading-relaxed">
                {product.description}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-3xl font-display font-black text-primary">₹{product.price}</span>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                {product.protein}g protein
              </span>
              <span className={product.stock > 0 ? "text-sm font-semibold text-emerald-400" : "text-sm font-semibold text-red-400"}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Protein", value: `${product.protein}g` },
                { label: "Sugar", value: "0g" },
                { label: "Fiber", value: "6g" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                  <div className="text-xl font-display font-bold text-white">{stat.value}</div>
                  <div className="mt-1 text-xs font-medium text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
              <div className="flex items-center gap-2 rounded-xl bg-white/[0.03] p-3">
                <Leaf className="h-4 w-4 text-primary" />
                Plant-powered nutrition
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white/[0.03] p-3">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Clean snack profile
              </div>
            </div>

            <Button
              className="h-12 w-full"
              disabled={product.stock === 0 || adding}
              onClick={() => onAddToCart(product)}
            >
              {adding ? (
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
      </DialogContent>
    </Dialog>
  );
}
