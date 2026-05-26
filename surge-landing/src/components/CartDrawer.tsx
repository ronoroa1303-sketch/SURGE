import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useLocation } from "wouter";
import { Loader2, Minus, Plus, ShoppingBag, Trash2, ArrowRight, Truck } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

interface CartDrawerProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ children, open, onOpenChange }: CartDrawerProps) {
  const { cartItems, cartCount, isLoading, addToCart, removeFromCart } = useCart();
  const [, navigate] = useLocation();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { toast } = useToast();

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.qty, 0);
  const freeShippingThreshold = 500;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleUpdateQty = async (productId: string, currentQty: number, delta: number) => {
    setUpdatingId(productId);
    try {
      if (delta > 0) {
        await addToCart(productId, 1);
      } else if (currentQty <= 1) {
        await removeFromCart(productId);
      } else {
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
      toast({ title: "Item removed" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md border-white/10 bg-black/95 backdrop-blur-xl flex flex-col p-0 h-[100dvh]">
        <SheetHeader className="p-6 border-b border-white/10">
          <SheetTitle className="text-xl font-display font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            Your Cart
            <span className="text-muted-foreground text-sm font-normal ml-2">
              {cartCount} {cartCount === 1 ? "item" : "items"}
            </span>
          </SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-white font-medium">Your cart is empty</p>
            <Button variant="outline" onClick={() => { onOpenChange(false); navigate("/shop"); }}>
              Browse Products
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 p-6">
              <motion.div
                layout
                className="space-y-6"
              >
                <AnimatePresence initial={false}>
                {cartItems.map((item) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 24 }}
                    className="flex gap-4 group"
                  >
                    <div className="w-20 h-20 rounded-lg bg-white/5 border border-white/10 flex-shrink-0 p-2 relative overflow-hidden">
                      <img
                        src={item.product?.imageUrl}
                        alt={item.product?.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-white text-sm line-clamp-1">{item.product?.name}</h4>
                          <p className="text-primary font-bold text-sm">₹{item.product?.price}</p>
                        </div>
                        <button
                          onClick={() => handleRemove(item.product?._id)}
                          disabled={updatingId === item.product?._id}
                          aria-label={`Remove ${item.product?.name} from cart`}
                          className="text-muted-foreground hover:text-red-400 transition-colors p-1 -mr-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-white/5 rounded-lg border border-white/10">
                          <button
                            onClick={() => handleUpdateQty(item.product?._id, item.qty, -1)}
                            disabled={updatingId === item.product?._id}
                            aria-label={`Decrease ${item.product?.name} quantity`}
                            className="p-1.5 text-white hover:text-primary transition-colors disabled:opacity-50"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-medium text-white">
                            {updatingId === item.product?._id ? (
                              <Loader2 className="w-3 h-3 animate-spin mx-auto" />
                            ) : (
                              item.qty
                            )}
                          </span>
                          <button
                            onClick={() => handleUpdateQty(item.product?._id, item.qty, 1)}
                            disabled={updatingId === item.product?._id}
                            aria-label={`Increase ${item.product?.name} quantity`}
                            className="p-1.5 text-white hover:text-primary transition-colors disabled:opacity-50"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-xs font-semibold text-white">
                          ₹{((item.product?.price || 0) * item.qty).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
                </AnimatePresence>
              </motion.div>
            </ScrollArea>

            <div className="border-t border-white/10 p-6 bg-black/50 backdrop-blur-md">
              <div className="space-y-3 mb-6">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <div className="mb-2 flex items-center justify-between gap-3 text-xs">
                    <span className="flex items-center gap-2 font-medium text-white/80">
                      <Truck className="h-3.5 w-3.5 text-primary" />
                      {amountToFreeShipping > 0
                        ? `₹${amountToFreeShipping.toFixed(2)} away from free shipping`
                        : "Free shipping unlocked"}
                    </span>
                    <span className="text-primary font-bold">{Math.round(freeShippingProgress)}%</span>
                  </div>
                  <Progress value={freeShippingProgress} className="h-1.5 bg-white/10" />
                </div>
                <div className="flex justify-between text-muted-foreground text-sm">
                  <span>Subtotal</span>
                  <motion.span
                    key={subtotal}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-white font-medium"
                  >
                    ₹{subtotal.toFixed(2)}
                  </motion.span>
                </div>
                <div className="flex justify-between text-muted-foreground text-sm">
                  <span>Shipping</span>
                  <span className={subtotal >= freeShippingThreshold ? "text-emerald-400" : "text-white"}>
                    {subtotal >= freeShippingThreshold ? "FREE" : "Calculated at checkout"}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="w-1/2" 
                  onClick={() => { onOpenChange(false); navigate("/cart"); }}
                >
                  View Cart
                </Button>
                <Button 
                  className="w-1/2"
                  onClick={() => { onOpenChange(false); navigate("/checkout"); }}
                >
                  Checkout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
