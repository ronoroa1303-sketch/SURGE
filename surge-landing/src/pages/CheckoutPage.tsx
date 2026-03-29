import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import * as api from "@/lib/api";
import { Loader2, CreditCard, ShoppingBag, ArrowLeft } from "lucide-react";

export default function CheckoutPage() {
  const { isAuthenticated, user } = useAuth();
  const { cartItems, cartCount, clearLocalCart } = useCart();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "India",
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 pt-28 pb-16 flex items-center justify-center">
          <div className="text-center space-y-4">
            <CreditCard className="w-16 h-16 text-muted-foreground mx-auto" />
            <h2 className="text-2xl font-display font-bold text-white">Please login to checkout</h2>
            <p className="text-muted-foreground">Click Login in the header to get started.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 pt-28 pb-16 flex items-center justify-center">
          <div className="text-center space-y-4">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto" />
            <h2 className="text-2xl font-display font-bold text-white">Your cart is empty</h2>
            <p className="text-muted-foreground">Add some products before checking out.</p>
            <Button onClick={() => navigate("/shop")} className="mt-4">Browse Products</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.qty, 0);
  const tax = +(subtotal * 0.18).toFixed(2);
  const shipping = subtotal > 500 ? 0 : 40;
  const total = subtotal + tax + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Send only orderItems + shippingAddress — backend calculates price
      const orderData = {
        orderItems: cartItems.map((item) => ({
          product: item.product._id,
          qty: item.qty,
        })),
        shippingAddress: {
          address: form.address,
          city: form.city,
          postalCode: form.postalCode,
          country: form.country,
        },
      };

      const order = await api.createOrder(orderData);
      clearLocalCart();
      toast({ title: "Order placed!", description: `Order #${order._id.slice(-8)} created successfully.` });
      navigate(`/order/${order._id}`);
    } catch (err: any) {
      setError(err.message || "Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pt-28 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate("/cart")}
            className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </button>

          <h1 className="text-3xl sm:text-4xl font-display font-black text-white mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Shipping Form */}
            <div className="lg:col-span-3">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-display font-bold text-white mb-6">Shipping Address</h2>

                {error && (
                  <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm px-4 py-3 rounded-lg mb-4">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-white/80 mb-1.5 block">Full Name</label>
                    <Input value={user?.name || ""} disabled className="opacity-60" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-white/80 mb-1.5 block">Address</label>
                    <Input
                      required
                      placeholder="123 Protein Street, Apt 4"
                      value={form.address}
                      onChange={(e) => updateField("address", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-white/80 mb-1.5 block">City</label>
                      <Input
                        required
                        placeholder="Mumbai"
                        value={form.city}
                        onChange={(e) => updateField("city", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-white/80 mb-1.5 block">Postal Code</label>
                      <Input
                        required
                        placeholder="400001"
                        value={form.postalCode}
                        onChange={(e) => updateField("postalCode", e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-white/80 mb-1.5 block">Country</label>
                    <Input
                      required
                      placeholder="India"
                      value={form.country}
                      onChange={(e) => updateField("country", e.target.value)}
                    />
                  </div>

                  <Button type="submit" className="w-full h-14 text-lg mt-4" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-5 w-5" />
                        Place Order — ₹{total.toFixed(2)}
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-28">
                <h2 className="text-xl font-display font-bold text-white mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-black/30 rounded-lg flex-shrink-0 overflow-hidden">
                        <img src={item.product?.imageUrl} alt={item.product?.name} className="w-full h-full object-contain p-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{item.product?.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.qty}</p>
                      </div>
                      <p className="text-sm text-white font-semibold">₹{(item.product?.price || 0) * item.qty}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="text-white">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Tax (18% GST)</span>
                    <span className="text-white">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Shipping</span>
                    <span className={subtotal > 500 ? "text-emerald-400" : "text-white"}>
                      {subtotal > 500 ? "FREE" : "₹40.00"}
                    </span>
                  </div>
                  <div className="border-t border-white/10 pt-3 flex justify-between">
                    <span className="text-white font-bold">Total</span>
                    <span className="text-primary font-bold text-lg">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
