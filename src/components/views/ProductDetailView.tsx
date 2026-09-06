"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ChevronLeft, ChevronRight, ArrowRight, ShoppingBag } from "lucide-react";
import { ProductCard } from "@/components/commerce/ProductCard";
import { QuantitySelector } from "@/components/commerce/QuantitySelector";
import { Media } from "@/components/media/Media";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Collection, Product } from "@/types/catalog";

interface ProductDetailViewProps {
  product: Product;
  collection: Collection | null;
  relatedProducts: Product[];
}

export const ProductDetailView = ({
  product,
  collection,
  relatedProducts,
}: ProductDetailViewProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const { addItem: addToCart } = useCart();
  const { toast } = useToast();

  const inWishlist = isInWishlist(product.id);

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist(product);
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been saved to your wishlist.`,
      });
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({
      title: "Added to bag",
      description: `${quantity} × ${product.name} added to your bag.`,
    });
    setQuantity(1);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="container-full py-6 border-b border-border">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Link href="/products" className="hover:text-foreground transition-colors">
            Shop
          </Link>
          <span className="text-border">/</span>
          {collection && (
            <>
              <Link
                href={`/products?collection=${collection.slug}`}
                className="hover:text-foreground transition-colors"
              >
                {collection.name}
              </Link>
              <span className="text-border">/</span>
            </>
          )}
          <span className="text-foreground">{product.name}</span>
        </div>
      </div>

      {/* Product Content */}
      <section className="py-10 md:py-16">
        <div className="container-full">
          <div className="grid lg:grid-cols-12 gap-8 md:gap-12 lg:gap-20">
            {/* Image Gallery — Takes 7 columns */}
            <div className="lg:col-span-7 space-y-4">
              {/* Main Image */}
              <div className="relative aspect-[4/5] overflow-hidden bg-muted/30 group cursor-zoom-in">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }}
                    className="absolute inset-0"
                  >
                    <Media
                      src={product.images[currentImageIndex]}
                      alt={product.name}
                      sizes="(min-width: 1024px) 58vw, 100vw"
                      priority={currentImageIndex === 0}
                      className="transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </motion.div>
                </AnimatePresence>

                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      aria-label="Previous image"
                      className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-10 p-2.5 sm:p-3 bg-background/90 backdrop-blur-md hover:bg-background transition-all duration-300 sm:opacity-0 sm:group-hover:opacity-100 sm:-translate-x-2 sm:group-hover:translate-x-0"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      aria-label="Next image"
                      className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-10 p-2.5 sm:p-3 bg-background/90 backdrop-blur-md hover:bg-background transition-all duration-300 sm:opacity-0 sm:group-hover:opacity-100 sm:translate-x-2 sm:group-hover:translate-x-0"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Image counter */}
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                      {product.images.map((image, index) => (
                        <button
                          key={image}
                          onClick={() => setCurrentImageIndex(index)}
                          aria-label={`View image ${index + 1}`}
                          className={cn(
                            "w-8 h-0.5 transition-all duration-500",
                            index === currentImageIndex
                              ? "bg-foreground"
                              : "bg-foreground/20 hover:bg-foreground/40"
                          )}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-5 left-5 z-10 flex flex-col gap-2">
                  {product.new && (
                    <span className="px-3 py-1.5 text-[10px] font-semibold tracking-[0.2em] uppercase bg-foreground text-background">
                      New
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnail strip */}
              {product.images.length > 1 && (
                <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide">
                  {product.images.map((image, index) => (
                    <button
                      key={image}
                      onClick={() => setCurrentImageIndex(index)}
                      aria-label={`View image ${index + 1}`}
                      className={cn(
                        "relative w-16 h-16 sm:w-24 sm:h-24 flex-shrink-0 overflow-hidden transition-all duration-300",
                        index === currentImageIndex
                          ? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                          : "opacity-60 hover:opacity-100"
                      )}
                    >
                      <Media
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        sizes="96px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info — Takes 5 columns */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const }}
              className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start"
            >
              {collection && (
                <Link
                  href={`/products?collection=${collection.slug}`}
                  className="inline-block text-[11px] font-semibold tracking-[0.3em] uppercase text-primary mb-5 hover:text-primary/80 transition-colors"
                >
                  {collection.name}
                </Link>
              )}

              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground mb-4 sm:mb-5 leading-[1.05]">
                {product.name}
              </h1>

              <p className="text-2xl font-serif text-foreground mb-8">
                {formatPrice(product.price)}
              </p>

              <div className="w-12 h-px bg-border mb-8" />

              <p className="text-muted-foreground leading-[1.8] mb-10">
                {product.longDescription}
              </p>

              {/* Details */}
              <div className="space-y-5 mb-10 pb-10 border-b border-border">
                <div>
                  <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-muted-foreground block mb-1.5">
                    Materials
                  </span>
                  <span className="text-sm text-foreground">{product.materials}</span>
                </div>
                {product.dimensions && (
                  <div>
                    <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-muted-foreground block mb-1.5">
                      Dimensions
                    </span>
                    <span className="text-sm text-foreground">{product.dimensions}</span>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-muted-foreground block mb-3">
                  Quantity
                </span>
                <QuantitySelector
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  className="rounded-none w-full py-6 text-sm tracking-[0.15em] uppercase btn-premium"
                >
                  <ShoppingBag className="w-4 h-4 mr-3" />
                  Add to Bag
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-none w-full py-6 text-sm tracking-[0.1em] uppercase"
                  onClick={handleWishlistToggle}
                >
                  <Heart
                    className={cn(
                      "w-4 h-4 mr-3 transition-all duration-300",
                      inWishlist && "fill-primary text-primary"
                    )}
                  />
                  {inWishlist ? "Saved to Wishlist" : "Add to Wishlist"}
                </Button>
              </div>

              {/* Trust signals */}
              <div className="mt-10 pt-8 border-t border-border grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-muted-foreground/60 mb-1">
                    Shipping
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Complimentary worldwide
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-muted-foreground/60 mb-1">
                    Returns
                  </p>
                  <p className="text-xs text-muted-foreground">
                    14-day return policy
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-20 md:py-28 bg-linen">
          <div className="container-full">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-primary mb-3">
                  You May Also Like
                </p>
                <h2 className="font-serif text-3xl md:text-4xl text-foreground">
                  More from {collection?.name}
                </h2>
              </div>
              <Link
                href={`/products?collection=${collection?.slug}`}
                className="hidden md:flex items-center gap-2 text-sm tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground transition-colors"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 md:gap-10">
              {relatedProducts.map((related, index) => (
                <ProductCard key={related.id} product={related} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};
