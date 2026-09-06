"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { browserStorage } from "@/lib/storage";
import type { Product } from "@/types/catalog";

interface WishlistState {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const { items } = get();
        if (!items.find((item) => item.id === product.id)) {
          set({ items: [...items, product] });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.id !== productId) });
      },

      isInWishlist: (productId) =>
        get().items.some((item) => item.id === productId),

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "rowan-ash-wishlist",
      storage: browserStorage,
      // See the note in useCart: rehydration is deferred to StoreHydration so
      // server and first client render agree.
      skipHydration: true,
    },
  ),
);
