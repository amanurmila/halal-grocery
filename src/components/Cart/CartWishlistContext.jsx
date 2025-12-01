"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const CartWishlistContext = createContext();

export function CartWishlistProvider({ children }) {
  const { data: session } = useSession();
  const [cartItems, setCartItems] = useState([]); // ✅ new
  const [wishlistLength, setWishlistLength] = useState(0);

  // Derived cart length
  const cartLength = cartItems?.length || 0;

  // ✅ Fetch when user logged in
  useEffect(() => {
    if (session?.user?.email) {
      fetchCart(session.user.email);
      fetchWishlist(session.user.email);
    }
  }, [session]);

  // 🔹 Fetch Cart
  async function fetchCart(userEmail) {
    try {
      const res = await fetch(`/api/cart?userEmail=${userEmail}`);
      const data = await res.json();
      if (data.success && data.cart?.items) {
        setCartItems(data.cart.items);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCartItems([]);
    }
  }

  // 🔹 Fetch Wishlist
  async function fetchWishlist(userEmail) {
    try {
      const res = await fetch(`/api/wishlist?userEmail=${userEmail}`);
      const data = await res.json();
      if (data.success) setWishlistLength(data.wishlist?.length || 0);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    }
  }

  // 🔹 Wishlist Actions
  const addToWishlist = () => setWishlistLength((prev) => prev + 1);
  const removeFromWishlist = () =>
    setWishlistLength((prev) => (prev > 0 ? prev - 1 : 0));

  // ✅ Clear Cart (after payment success)
  const clearCart = async () => {
    setCartItems([]); // clear frontend immediately

    if (session?.user?.email) {
      try {
        const res = await fetch("/api/cart/clear", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userEmail: session.user.email }),
        });
        const data = await res.json();
        if (!data.success) {
          console.error("Cart clear failed:", data.message);
        }
      } catch (err) {
        console.error("Error clearing cart:", err);
      }
    }
  };

  return (
    <CartWishlistContext.Provider
      value={{
        cartItems, // ✅ added
        cartLength,
        wishlistLength,
        fetchCart,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
        clearCart,
      }}
    >
      {children}
    </CartWishlistContext.Provider>
  );
}

export function useCartWishlist() {
  return useContext(CartWishlistContext);
}
