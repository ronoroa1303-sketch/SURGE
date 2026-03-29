import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import * as api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
    stock: number;
  };
  qty: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, qty: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearLocalCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const data = await api.getCart();
      // GET /api/cart returns populated product data
      setCartItems(data.items || []);
    } catch {
      // Silently fail — user might just not have a cart yet
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch cart whenever auth state changes to authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated, fetchCart]);

  const addToCart = useCallback(async (productId: string, qty: number) => {
    // POST /api/cart returns un-populated data, so we re-fetch to get full product details
    await api.addToCart({ productId, qty });
    await fetchCart();
  }, [fetchCart]);

  const removeFromCart = useCallback(async (productId: string) => {
    // DELETE /api/cart/:productId returns un-populated data, so we re-fetch
    await api.removeFromCart(productId);
    await fetchCart();
  }, [fetchCart]);

  const clearLocalCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        isLoading,
        fetchCart,
        addToCart,
        removeFromCart,
        clearLocalCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
