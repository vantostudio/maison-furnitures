"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { browserStorage } from "@/lib/storage";
import type { Product } from "@/types/catalog";

export const MAX_QUANTITY_PER_ITEM = 10;

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id,
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? {
                      ...item,
                      quantity: Math.min(
                        item.quantity + quantity,
                        MAX_QUANTITY_PER_ITEM,
                      ),
                    }
                  : item,
              ),
            };
          }

          return {
            items: [...state.items, { product, quantity }],
          };
        });
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity < 1) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId
              ? { ...item, quantity: Math.min(quantity, MAX_QUANTITY_PER_ITEM) }
              : item,
          ),
        }));
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getSubtotal: () =>
        get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0,
        ),

      getItemCount: () =>
        get().items.reduce((count, item) => count + item.quantity, 0),
    }),
    {
      name: "rowan-ash-cart",
      storage: browserStorage,
      // The server has no localStorage, so the first client render must match
      // the server's empty cart. StoreHydration rehydrates after mount.
      skipHydration: true,
    },
  ),
);
