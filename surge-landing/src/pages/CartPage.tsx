import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useLocation } from "wouter";
import { Trash2, Plus, Minus, ShoppingBag, Loader2, ArrowRight, BadgePercent, Truck } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

const FREE_SHIPPING_THRESHOLD = 500;
const SHIPPING_FEE = 40;
const GST_RATE = 0.18;
const PROMO_CODES: Record<string, number> = {
  SURGE10: 0.1,
  PROTEIN15: 0.15,
};

function AnimatedAmount({ value, className = "text-white font-semibold" }: { value: number; className?: string }) {
  return (
    <motion.span
      key={value.toFixed(2)}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className={className}
    >
      ₹{value.toFixed(2)}
    </motion.span>
  );
}

export default function CartPage() {
  const { isAuthenticated } = useAuth();
  const { cartItems, cartCount, isLoading, addToCart, removeFromCart, fetchCart } = useCart();
  const [, navigate] = useLocation();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
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
  const discountRate = appliedPromo ? PROMO_CODES[appliedPromo] : 0;
  const discount = subtotal * discountRate;
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = taxableAmount * GST_RATE;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = taxableAmount + tax + shipping;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;

    if (!PROMO_CODES[code]) {
      setAppliedPromo(null);
      toast({
        title: "Promo code not found",
        description: "Try SURGE10 for 10% off.",
        variant: "destructive",
      });
      return;
    }

    setAppliedPromo(code);
    setPromoInput(code);
    toast({
      title: "Promo applied",
      description: `${code} saved you ₹${(subtotal * PROMO_CODES[code]).toFixed(2)}.`,
    });
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoInput("");
  };

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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="space-y-6 lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-6 lg:space-y-0">
              {/* Cart Items */}
              <div className="space-y-4">
                <AnimatePresence initial={false}>
                {cartItems.map((item) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -24 }}
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
                        aria-label={`Decrease ${item.product?.name} quantity`}
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
                        aria-label={`Increase ${item.product?.name} quantity`}
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
                      aria-label={`Remove ${item.product?.name} from cart`}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
                </AnimatePresence>
              </div>

              {/* Summary */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5 self-start lg:sticky lg:top-28">
                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="mb-3 flex items-center justify-between gap-3 text-sm">
                    <span className="flex items-center gap-2 font-semibold text-white">
                      <Truck className="h-4 w-4 text-primary" />
                      Free Shipping
                    </span>
                    <span className="text-xs font-bold text-primary">{Math.round(freeShippingProgress)}%</span>
                  </div>
                  <Progress value={freeShippingProgress} className="bg-white/10" />
                  <p className="mt-3 text-sm text-muted-foreground">
                    {amountToFreeShipping > 0
                      ? `You are ₹${amountToFreeShipping.toFixed(2)} away from free shipping.`
                      : "Free shipping unlocked for this order."}
                  </p>
                </div>

                <div className="space-y-3">
                  <label htmlFor="promo-code" className="flex items-center gap-2 text-sm font-semibold text-white">
                    <BadgePercent className="h-4 w-4 text-primary" />
                    Promo Code
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="promo-code"
                      value={promoInput}
                      onChange={(event) => setPromoInput(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") handleApplyPromo();
                      }}
                      placeholder="SURGE10"
                      className="h-11 bg-black/30 uppercase text-white"
                    />
                    <Button type="button" variant="outline" onClick={handleApplyPromo}>
                      Apply
                    </Button>
                  </div>
                  {appliedPromo && (
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="text-xs font-medium text-primary hover:text-primary/80"
                    >
                      Remove {appliedPromo}
                    </button>
                  )}
                </div>

                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({cartCount} items)</span>
                  <AnimatedAmount value={subtotal} />
                </div>
                <AnimatePresence>
                  {discount > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex justify-between overflow-hidden text-emerald-400"
                    >
                      <span>Discount Savings</span>
                      <span className="font-semibold">-₹{discount.toFixed(2)}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax (18% GST)</span>
                  <AnimatedAmount value={tax} />
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className={`font-semibold ${shipping === 0 ? "text-emerald-400" : "text-white"}`}>
                    {shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t border-white/10 pt-4 flex justify-between">
                  <span className="text-white font-display font-bold text-lg">Total</span>
                  <AnimatedAmount value={total} className="text-primary font-display font-bold text-lg" />
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
