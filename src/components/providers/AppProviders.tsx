"use client";

import { useEffect, type ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";

/**
 * Both persisted stores are created with `skipHydration`, so the first client
 * render matches the server's empty state. Rehydrating here, after mount,
 * restores the saved cart and wishlist without a hydration mismatch.
 */
const StoreHydration = () => {
  useEffect(() => {
    void useCart.persist.rehydrate();
    void useWishlist.persist.rehydrate();
  }, []);

  return null;
};

export const AppProviders = ({ children }: { children: ReactNode }) => (
  <TooltipProvider>
    <StoreHydration />
    {children}
    <Toaster />
  </TooltipProvider>
);
