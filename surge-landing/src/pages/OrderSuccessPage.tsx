import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useLocation, useRoute } from "wouter";
import * as api from "@/lib/api";
import { CheckCircle, Loader2, Package, ArrowRight } from "lucide-react";

interface Order {
  _id: string;
  orderItems: Array<{
    name: string;
    qty: number;
    price: number;
    image?: string;
  }>;
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  status: string;
  isPaid: boolean;
  createdAt: string;
}

export default function OrderSuccessPage() {
  const [, params] = useRoute("/order/:id");
  const [, navigate] = useLocation();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      if (!params?.id) return;
      try {
        const data = await api.fetchApi(`/order/${params.id}`);
        setOrder(data);
      } catch (err: any) {
        setError(err.message || "Could not load order details.");
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [params?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 pt-28 pb-16 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 pt-28 pb-16 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Package className="w-16 h-16 text-muted-foreground mx-auto" />
            <h2 className="text-2xl font-display font-bold text-white">Order not found</h2>
            <p className="text-muted-foreground">{error || "This order doesn't exist."}</p>
            <Button onClick={() => navigate("/shop")}>Continue Shopping</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pt-28 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Banner */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-black text-white mb-3">
              Order Placed!
            </h1>
            <p className="text-muted-foreground text-lg">
              Thank you for your order. Your SURGE protein snacks are on the way!
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Order ID</p>
                <p className="text-white font-mono font-semibold">#{order._id.slice(-8).toUpperCase()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Status</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary capitalize">
                  {order.status}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="border-t border-white/10 pt-4 space-y-3">
              {order.orderItems.map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-white">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.qty} × ₹{item.price}</p>
                  </div>
                  <p className="text-sm text-white font-semibold">₹{item.price * item.qty}</p>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div className="border-t border-white/10 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span className="text-white">₹{order.itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Tax</span>
                <span className="text-white">₹{order.taxPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Shipping</span>
                <span className={order.shippingPrice === 0 ? "text-emerald-400" : "text-white"}>
                  {order.shippingPrice === 0 ? "FREE" : `₹${order.shippingPrice.toFixed(2)}`}
                </span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between">
                <span className="text-white font-bold text-lg">Total Paid</span>
                <span className="text-primary font-bold text-lg">₹{order.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Shipping */}
            <div className="border-t border-white/10 pt-4">
              <p className="text-xs text-muted-foreground mb-1">Shipping To</p>
              <p className="text-sm text-white">
                {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
              </p>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <Button variant="outline" className="flex-1" onClick={() => navigate("/")}>
              Back to Home
            </Button>
            <Button className="flex-1" onClick={() => navigate("/shop")}>
              Continue Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
