"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Heart, X, ShoppingBag, Eye, Undo2 } from "lucide-react";
import { QuickViewDialog } from "@/components/commerce/QuickViewDialog";
import { Media } from "@/components/media/Media";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/format";
import type { Collection, Product } from "@/types/catalog";

const EmptyState = ({ collections }: { collections: Collection[] }) => (
  <div className="container-narrow py-20 md:py-28 text-center">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative mx-auto mb-8 w-24 h-24 md:w-28 md:h-28 flex items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-muted/60" />
        <span className="absolute inset-0 rounded-full border border-border animate-pulse" />
        <Heart className="relative w-9 h-9 md:w-11 md:h-11 text-muted-foreground/50" />
      </div>

      <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-muted-foreground/70 mb-3">
        Your Collection
      </p>
      <h1 className="font-serif text-3xl md:text-4xl mb-4">Nothing saved yet</h1>
      <p className="text-muted-foreground mb-10 max-w-md mx-auto leading-relaxed">
        Tap the heart on any piece and it will live here — ready whenever you
        are, saved on this device.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center mb-14">
        <Button
          asChild
          size="lg"
          className="rounded-none px-10 py-6 text-sm tracking-[0.15em] uppercase btn-premium"
        >
          <Link href="/products">
            Explore Pieces
            <ArrowRight className="ml-3 w-4 h-4" />
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="rounded-none px-10 py-6 text-sm tracking-[0.15em] uppercase"
        >
          <Link href="/">Back Home</Link>
        </Button>
      </div>

      <div className="border-t border-border pt-8">
        <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-muted-foreground/60 mb-4">
          Browse a collection
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {collections.map((c) => (
            <Link
              key={c.id}
              href={`/products?collection=${c.slug}`}
              className="px-4 py-2 text-xs tracking-[0.12em] uppercase border border-border hover:bg-foreground hover:text-background transition-colors"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  </div>
);

export const FavoritesView = ({ collections }: { collections: Collection[] }) => {
  const { items, removeItem, addItem: addWish, clearWishlist } = useWishlist();
  const { addItem: addToCart } = useCart();
  const { toast } = useToast();
  const [quickView, setQuickView] = useState<Product | null>(null);

  const handleRemove = (product: Product) => {
    removeItem(product.id);
    toast({
      title: "Removed from favorites",
      description: product.name,
      action: (
        <button
          onClick={() => addWish(product)}
          className="inline-flex items-center gap-1.5 text-xs tracking-[0.1em] uppercase underline underline-offset-4"
        >
          <Undo2 className="w-3.5 h-3.5" />
          Undo
        </button>
      ),
    });
  };

  const handleMoveToBag = (product: Product) => {
    addToCart(product, 1);
    removeItem(product.id);
    toast({ title: "Moved to bag", description: product.name });
  };

  const handleClearAll = () => {
    const snapshot = items;
    clearWishlist();
    toast({
      title: "Favorites cleared",
      description: `${snapshot.length} ${snapshot.length === 1 ? "piece" : "pieces"} removed`,
      action: (
        <button
          onClick={() => snapshot.forEach(addWish)}
          className="inline-flex items-center gap-1.5 text-xs tracking-[0.1em] uppercase underline underline-offset-4"
        >
          <Undo2 className="w-3.5 h-3.5" />
          Undo
        </button>
      ),
    });
  };

  if (items.length === 0) return <EmptyState collections={collections} />;

  return (
    <>
      <div className="container-full py-6 border-b border-border">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Link href="/products" className="hover:text-foreground transition-colors">
            Shop
          </Link>
          <span className="text-border">/</span>
          <span className="text-foreground">Favorites</span>
        </div>
      </div>

      <section className="py-10 md:py-16">
        <div className="container-full">
          <div className="flex items-end justify-between gap-4 mb-8 md:mb-12">
            <div>
              <h1 className="font-serif text-3xl md:text-5xl leading-tight">Favorites</h1>
              <p className="text-sm text-muted-foreground mt-2">
                {items.length} saved {items.length === 1 ? "piece" : "pieces"}
              </p>
            </div>
            <button
              onClick={handleClearAll}
              className="text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 sm:gap-x-8 sm:gap-y-14">
            <AnimatePresence mode="popLayout">
              {items.map((product) => (
                <motion.article
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35 }}
                  className="group"
                >
                  <div className="relative overflow-hidden bg-muted/50 aspect-[4/5] mb-3 sm:mb-5">
                    <Link href={`/products/${product.slug}`} className="absolute inset-0">
                      <Media
                        src={product.images[0]}
                        alt={product.name}
                        sizes="(min-width: 1024px) 33vw, 50vw"
                        className="transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    </Link>

                    <button
                      onClick={() => handleRemove(product)}
                      aria-label={`Remove ${product.name} from favorites`}
                      className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 p-2 rounded-full bg-background/90 backdrop-blur-md shadow-sm hover:bg-background transition-colors"
                    >
                      <X className="w-3.5 h-3.5 text-foreground" />
                    </button>

                    <button
                      onClick={() => setQuickView(product)}
                      aria-label={`Quick view ${product.name}`}
                      className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 z-10 p-2 rounded-full bg-background/90 backdrop-blur-md shadow-sm hover:bg-background transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-foreground" />
                    </button>
                  </div>

                  <h3 className="font-serif text-base sm:text-xl leading-snug">
                    <Link href={`/products/${product.slug}`} className="hover:text-primary transition-colors">
                      {product.name}
                    </Link>
                  </h3>
                  <p className="text-sm sm:text-base font-medium mt-1 tracking-wide">
                    {formatPrice(product.price)}
                  </p>

                  <div className="mt-3 flex flex-col sm:flex-row gap-2">
                    <Button
                      onClick={() => handleMoveToBag(product)}
                      className="flex-1 rounded-none py-5 text-[10px] sm:text-xs tracking-[0.15em] uppercase"
                    >
                      <ShoppingBag className="mr-2 w-3.5 h-3.5" />
                      Move to Bag
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleRemove(product)}
                      className="rounded-none py-5 text-[10px] sm:text-xs tracking-[0.15em] uppercase sm:w-auto"
                    >
                      Remove
                    </Button>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <QuickViewDialog
        product={quickView}
        open={!!quickView}
        onOpenChange={(o) => !o && setQuickView(null)}
      />
    </>
  );
};
