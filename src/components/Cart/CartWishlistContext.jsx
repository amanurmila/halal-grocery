"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const CartWishlistContext = createContext();

export function CartWishlistProvider({ children }) {
  const { data: session } = useSession();
  const [cartLength, setCartLength] = useState(0);
  const [wishlistLength, setWishlistLength] = useState(0);

  // Fetch on login
  useEffect(() => {
    if (session?.user?.email) {
      fetchCart(session.user.email);
      fetchWishlist(session.user.email);
    }
  }, [session]);

  async function fetchCart(userEmail) {
    try {
      const res = await fetch(`/api/cart?userEmail=${userEmail}`);
      const data = await res.json();
      if (data.success) setCartLength(data.cart.items?.length || 0);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  }

  async function fetchWishlist(userEmail) {
    try {
      const res = await fetch(`/api/wishlist?userEmail=${userEmail}`);
      const data = await res.json();
      if (data.success) setWishlistLength(data.wishlist?.length || 0);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    }
  }

  // New: Increment / decrement without refetch
  const addToWishlist = () => setWishlistLength((prev) => prev + 1);
  const removeFromWishlist = () =>
    setWishlistLength((prev) => (prev > 0 ? prev - 1 : 0));

  return (
    <CartWishlistContext.Provider
      value={{
        cartLength,
        wishlistLength,
        fetchCart,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </CartWishlistContext.Provider>
  );
}

export function useCartWishlist() {
  return useContext(CartWishlistContext);
}
