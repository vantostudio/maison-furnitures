"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Heart, ChevronLeft, ChevronRight, Truck, Check } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Media } from "@/components/media/Media";
import { QuantitySelector } from "@/components/commerce/QuantitySelector";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useToast } from "@/hooks/use-toast";
import { getCollectionById } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/catalog";

interface QuickViewDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Rendered only while the dialog is open and keyed by product, so quantity,
 * gallery position and the "added" flag reset on every open without an effect.
 */
const QuickViewContent = ({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) => {
  const [quantity, setQuantity] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const { addItem: addWish, removeItem: removeWish, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const router = useRouter();

  const imageCount = product.images.length;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setImageIndex((i) => (i - 1 + imageCount) % imageCount);
      } else if (e.key === "ArrowRight") {
        setImageIndex((i) => (i + 1) % imageCount);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [imageCount]);

  const collection = getCollectionById(product.collection);
  const inWishlist = isInWishlist(product.id);
  const lineTotal = product.price * quantity;

  const handleAdd = () => {
    addItem(product, quantity);
    setAdded(true);
    toast({
      title: "Added to bag",
      description: `${product.name} × ${quantity}`,
    });
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    onClose();
    router.push("/cart");
  };

  const step = (dir: number) => {
    setImageIndex((i) => (i + dir + imageCount) % imageCount);
  };

  return (
    <>
      <DialogTitle className="sr-only">{product.name}</DialogTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2">
        {/* Image */}
        <div className="relative bg-muted/50">
          <div className="relative aspect-[4/5] sm:aspect-auto sm:h-[520px]">
            <Media
              src={product.images[imageIndex]}
              alt={`${product.name} — view ${imageIndex + 1}`}
              sizes="(min-width: 640px) 50vw, 100vw"
            />
            {product.new && (
              <span className="absolute top-3 left-3 z-10 px-2 py-1 text-[9px] font-semibold tracking-[0.2em] uppercase bg-foreground text-background">
                New
              </span>
            )}
            {imageCount > 1 && (
              <>
                <button
                  onClick={() => step(-1)}
                  aria-label="Previous image"
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/90 backdrop-blur-md hover:bg-background transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => step(1)}
                  aria-label="Next image"
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/90 backdrop-blur-md hover:bg-background transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <span className="absolute bottom-3 right-3 z-10 px-2 py-1 text-[10px] tracking-[0.15em] bg-background/85 backdrop-blur-md tabular-nums">
                  {imageIndex + 1} / {imageCount}
                </span>
                <div className="absolute bottom-3 left-3 z-10 flex gap-1.5">
                  {product.images.map((img, i) => (
                    <button
                      key={img}
                      onClick={() => setImageIndex(i)}
                      aria-label={`Go to image ${i + 1}`}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        i === imageIndex ? "w-5 bg-foreground" : "w-1.5 bg-foreground/40"
                      )}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {imageCount > 1 && (
            <div className="flex gap-2 p-2 overflow-x-auto scrollbar-hide">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setImageIndex(i)}
                  aria-label={`View image ${i + 1}`}
                  className={cn(
                    "relative shrink-0 w-14 h-16 overflow-hidden border transition-colors",
                    i === imageIndex ? "border-foreground" : "border-transparent opacity-60"
                  )}
                >
                  <Media src={img} alt="" sizes="56px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="p-5 sm:p-8 flex flex-col">
          {collection && (
            <Link
              href={`/products?collection=${collection.slug}`}
              onClick={onClose}
              className="text-[10px] font-semibold tracking-[0.25em] uppercase text-muted-foreground hover:text-foreground transition-colors mb-2"
            >
              {collection.name}
            </Link>
          )}
          <h2 className="font-serif text-2xl sm:text-3xl leading-tight mb-2">
            {product.name}
          </h2>
          <div className="flex items-baseline gap-3 mb-4">
            <p className="text-lg font-medium">{formatPrice(product.price)}</p>
            <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/70">
              In stock
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-4">
            {product.description}
          </p>

          <dl className="grid grid-cols-1 gap-px bg-border border border-border mb-5 text-xs">
            {product.materials && (
              <div className="flex gap-3 bg-background px-3 py-2.5">
                <dt className="w-24 shrink-0 uppercase tracking-[0.15em] text-muted-foreground/60">Materials</dt>
                <dd className="flex-1 text-muted-foreground">{product.materials}</dd>
              </div>
            )}
            {product.dimensions && (
              <div className="flex gap-3 bg-background px-3 py-2.5">
                <dt className="w-24 shrink-0 uppercase tracking-[0.15em] text-muted-foreground/60">Dimensions</dt>
                <dd className="flex-1 text-muted-foreground">{product.dimensions}</dd>
              </div>
            )}
            {collection && (
              <div className="flex gap-3 bg-background px-3 py-2.5">
                <dt className="w-24 shrink-0 uppercase tracking-[0.15em] text-muted-foreground/60">Collection</dt>
                <dd className="flex-1 text-muted-foreground">{collection.name}</dd>
              </div>
            )}
          </dl>

          <p className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
            <Truck className="w-3.5 h-3.5" />
            {product.price >= site.freeShippingThreshold
              ? "Free shipping on this piece"
              : `Free shipping over ${formatPrice(site.freeShippingThreshold)}`}
          </p>

          <div className="mt-auto space-y-3">
            <div className="flex items-center justify-between gap-3">
              <QuantitySelector quantity={quantity} onQuantityChange={setQuantity} />
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium tabular-nums">
                  {formatPrice(lineTotal)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={inWishlist ? "Remove from favorites" : "Add to favorites"}
                  onClick={() => (inWishlist ? removeWish(product.id) : addWish(product))}
                  className="h-11 w-11 rounded-none border border-border"
                >
                  <Heart
                    className={cn("w-4 h-4", inWishlist && "fill-primary text-primary")}
                  />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={handleAdd}
                variant="outline"
                className="rounded-none py-6 text-xs tracking-[0.2em] uppercase"
              >
                {added ? (
                  <>
                    <Check className="mr-2 w-4 h-4" /> Added
                  </>
                ) : (
                  "Add to Bag"
                )}
              </Button>
              <Button
                onClick={handleBuyNow}
                className="rounded-none py-6 text-xs tracking-[0.2em] uppercase"
              >
                Buy Now
              </Button>
            </div>
            <Button
              asChild
              variant="ghost"
              className="w-full rounded-none py-5 text-xs tracking-[0.2em] uppercase"
              onClick={onClose}
            >
              <Link href={`/products/${product.slug}`}>
                View Full Details
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export const QuickViewDialog = ({ product, open, onOpenChange }: QuickViewDialogProps) => {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0 rounded-none max-w-[calc(100vw-2rem)] sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <QuickViewContent
          key={product.id}
          product={product}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
