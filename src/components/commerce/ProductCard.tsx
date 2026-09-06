"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { Media } from "@/components/media/Media";
import { QuickViewDialog } from "@/components/commerce/QuickViewDialog";
import { useWishlist } from "@/hooks/useWishlist";
import { getCollectionById } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/catalog";

const CARD_SIZES = "(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 50vw";

interface ProductCardProps {
  product: Product;
  index?: number;
  variant?: "default" | "large";
}

export const ProductCard = ({ product, index = 0, variant = "default" }: ProductCardProps) => {
  const { addItem, removeItem, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);
  const collection = getCollectionById(product.collection);
  const hasSecondImage = product.images.length > 1;
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeItem(product.id);
    } else {
      addItem(product);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewOpen(true);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: Math.min(index, 4) * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group"
    >
      <Link href={`/products/${product.slug}`} className="block">
        {/* Image Container */}
        <div
          className={cn(
            "relative overflow-hidden bg-muted/50 mb-3 sm:mb-5",
            variant === "large" ? "aspect-[3/4]" : "aspect-[4/5]"
          )}
        >
          {/* Primary Image */}
          <Media
            src={product.images[0]}
            alt={product.name}
            sizes={CARD_SIZES}
            className={cn(
              "transition-all duration-500 ease-out",
              hasSecondImage
                ? "group-hover:opacity-0 group-hover:scale-105"
                : "group-hover:scale-105"
            )}
          />

          {/* Secondary Image (hover) */}
          {hasSecondImage && (
            <Media
              src={product.images[1]}
              alt={`${product.name} - alternate view`}
              sizes={CARD_SIZES}
              className="opacity-0 scale-105 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-100"
            />
          )}

          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Wishlist button */}
          <button
            onClick={handleWishlistToggle}
            aria-label={inWishlist ? `Remove ${product.name} from favorites` : `Save ${product.name} to favorites`}
            className={cn(
              "absolute top-2 right-2 sm:top-5 sm:right-5 z-10 p-2 sm:p-2.5 rounded-full transition-all duration-500",
              "bg-background/90 backdrop-blur-md hover:bg-background shadow-sm",
              "sm:opacity-0 sm:translate-y-2 sm:group-hover:opacity-100 sm:group-hover:translate-y-0",
              inWishlist && "opacity-100 translate-y-0"
            )}
          >
            <Heart
              className={cn(
                "w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-300",
                inWishlist ? "fill-primary text-primary scale-110" : "text-foreground"
              )}
            />
          </button>

          {/* Badges */}
          <div className="absolute top-2 left-2 sm:top-5 sm:left-5 z-10 flex flex-col gap-1.5 sm:gap-2">
            {product.new && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="px-2 py-1 sm:px-3 sm:py-1.5 text-[9px] sm:text-[10px] font-semibold tracking-[0.2em] uppercase bg-foreground text-background"
              >
                New
              </motion.span>
            )}
          </div>

          {/* Quick View (mobile icon) */}
          <button
            onClick={handleQuickView}
            aria-label={`Quick view ${product.name}`}
            className="sm:hidden absolute bottom-2 right-2 z-10 p-2 rounded-full bg-background/90 backdrop-blur-md shadow-sm"
          >
            <Eye className="w-3.5 h-3.5 text-foreground" />
          </button>

          {/* Quick View (desktop hover) */}
          <div className="hidden sm:flex absolute bottom-0 left-0 right-0 z-10 items-center justify-center pb-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
            <button
              onClick={handleQuickView}
              className="px-6 py-2.5 text-xs font-medium tracking-[0.15em] uppercase bg-background/95 backdrop-blur-md text-foreground shadow-lg hover:bg-background"
            >
              Quick View
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-1 sm:space-y-2">
          {/* Collection label */}
          {collection && (
            <p className="text-[10px] sm:text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground/70 transition-colors duration-300 group-hover:text-primary">
              {collection.name}
            </p>
          )}

          <h3 className="font-serif text-base sm:text-xl text-foreground transition-colors duration-300 group-hover:text-primary leading-snug">
            {product.name}
          </h3>

          <p className="hidden sm:block text-sm text-muted-foreground line-clamp-1 leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center gap-2 sm:gap-3 pt-1 flex-wrap">
            <p className="text-sm sm:text-base font-medium text-foreground tracking-wide">
              {formatPrice(product.price)}
            </p>
            {product.materials && (
              <>
                <span className="hidden sm:inline w-px h-3 bg-border" />
                <p className="hidden sm:block text-xs text-muted-foreground/60 tracking-wide">
                  {product.materials.split(",")[0]}
                </p>
              </>
            )}
          </div>
        </div>
      </Link>

      <QuickViewDialog
        product={product}
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
      />
    </motion.article>
  );
};
