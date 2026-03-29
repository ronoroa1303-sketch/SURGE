import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useLocation } from "wouter";
import { Trash2, Plus, Minus, ShoppingBag, Loader2, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function CartPage() {
  const { isAuthenticated } = useAuth();
  const { cartItems, cartCount, isLoading, addToCart, removeFromCart, fetchCart } = useCart();
  const [, navigate] = useLocation();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { toast } = useToast();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 pt-28 pb-16 flex items-center justify-center">
          <div className="text-center space-y-4">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto" />
            <h2 className="text-2xl font-display font-bold text-white">Please login to view your cart</h2>
            <p className="text-muted-foreground">Click Login in the header to get started.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.qty, 0);

  const handleUpdateQty = async (productId: string, currentQty: number, delta: number) => {
    setUpdatingId(productId);
    try {
      if (delta > 0) {
        await addToCart(productId, 1);
      } else if (currentQty <= 1) {
        await removeFromCart(productId);
      } else {
        // To decrease: remove entire item, then re-add with (qty - 1)
        await removeFromCart(productId);
        await addToCart(productId, currentQty - 1);
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (productId: string) => {
    setUpdatingId(productId);
    try {
      await removeFromCart(productId);
      toast({ title: "Item removed from cart" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-display font-black text-white mb-8">
            Your Cart {cartCount > 0 && <span className="text-primary">({cartCount})</span>}
          </h1>

          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {!isLoading && cartItems.length === 0 && (
            <div className="text-center py-20 space-y-4">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto" />
              <h2 className="text-xl font-bold text-white">Your cart is empty</h2>
              <p className="text-muted-foreground">Start shopping to add items to your cart.</p>
              <Button onClick={() => navigate("/shop")} className="mt-4">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Browse Products
              </Button>
            </div>
          )}

          {!isLoading && cartItems.length > 0 && (
            <div className="space-y-6">
              {/* Cart Items */}
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors"
                  >
                    {/* Image */}
                    <div className="w-20 h-20 bg-black/30 rounded-lg flex-shrink-0 overflow-hidden">
                      <img
                        src={item.product?.imageUrl}
                        alt={item.product?.name}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white text-sm truncate">{item.product?.name}</h3>
                      <p className="text-primary font-semibold">₹{item.product?.price}</p>
                    </div>

                    {/* Qty Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateQty(item.product?._id, item.qty, -1)}
                        disabled={updatingId === item.product?._id}
                        className="w-8 h-8 rounded-lg bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors disabled:opacity-50"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-white font-bold w-8 text-center">
                        {updatingId === item.product?._id ? (
                          <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                        ) : (
                          item.qty
                        )}
                      </span>
                      <button
                        onClick={() => handleUpdateQty(item.product?._id, item.qty, 1)}
                        disabled={updatingId === item.product?._id}
                        className="w-8 h-8 rounded-lg bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors disabled:opacity-50"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="text-right w-20 flex-shrink-0">
                      <p className="text-white font-bold">₹{(item.product?.price || 0) * item.qty}</p>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => handleRemove(item.product?._id)}
                      disabled={updatingId === item.product?._id}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({cartCount} items)</span>
                  <span className="text-white font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax (18% GST)</span>
                  <span className="text-white font-semibold">₹{(subtotal * 0.18).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className={`font-semibold ${subtotal > 500 ? "text-emerald-400" : "text-white"}`}>
                    {subtotal > 500 ? "FREE" : "₹40.00"}
                  </span>
                </div>
                <div className="border-t border-white/10 pt-4 flex justify-between">
                  <span className="text-white font-display font-bold text-lg">Total</span>
                  <span className="text-primary font-display font-bold text-lg">
                    ₹{(subtotal + subtotal * 0.18 + (subtotal > 500 ? 0 : 40)).toFixed(2)}
                  </span>
                </div>

                <Button
                  className="w-full h-14 text-lg mt-2"
                  onClick={() => navigate("/checkout")}
                >
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
