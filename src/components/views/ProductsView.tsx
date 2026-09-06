"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, SlidersHorizontal, X, Check } from "lucide-react";
import { ProductCard } from "@/components/commerce/ProductCard";
import { Media } from "@/components/media/Media";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import {
  DEFAULT_SORT,
  SORT_OPTIONS,
  type Collection,
  type Product,
  type SortOption,
} from "@/types/catalog";

const FALLBACK_HERO =
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80";
const CTA_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80";

interface ProductsViewProps {
  products: Product[];
  collections: Collection[];
  activeCollection: string;
  activeSort: SortOption;
  currentCollection: Collection | null;
}

export const ProductsView = ({
  products,
  collections,
  activeCollection,
  activeSort,
  currentCollection,
}: ProductsViewProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  /** Filter state lives in the URL so the server can do the querying. */
  const commit = (params: URLSearchParams) => {
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const handleFilterChange = (slug: string) => {
    const params = new URLSearchParams(searchParams);
    if (slug === "all") {
      params.delete("collection");
    } else {
      params.set("collection", slug);
    }
    commit(params);
  };

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === DEFAULT_SORT) {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    commit(params);
  };

  const activeSortLabel =
    SORT_OPTIONS.find((option) => option.value === activeSort)?.label ?? "Newest";
  const hasActiveFilters = activeCollection !== "all" || activeSort !== DEFAULT_SORT;

  return (
    <>
      {/* Hero Banner */}
      <section className="relative h-[40vh] md:h-[55vh] overflow-hidden">
        <div className="absolute inset-0">
          <Media
            src={currentCollection?.heroImage || FALLBACK_HERO}
            alt={currentCollection?.name || "All Products"}
            priority
            className="transition-opacity duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-charcoal/20 to-charcoal/10" />
        </div>

        <div className="relative container-full h-full flex flex-col justify-end pb-12 md:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          >
            <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-white/50 mb-3">
              {currentCollection ? "Collection" : "Shop"}
            </p>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white mb-3 leading-[0.95]">
              {currentCollection ? currentCollection.name : "All Pieces"}
            </h1>
            {currentCollection && (
              <p className="text-base text-white/70 max-w-lg">
                {currentCollection.description}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Filters & Sorting */}
      <section className="py-3 md:py-5 border-b border-border sticky top-16 md:top-20 bg-background/95 backdrop-blur-md z-40">
        <div className="container-full">
          {/* Mobile bar */}
          <div className="flex md:hidden items-center gap-3">
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-none flex-1 justify-between h-11 text-xs tracking-[0.1em] uppercase"
                >
                  <span className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    Filter & Sort
                  </span>
                  {hasActiveFilters && (
                    <span className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh] overflow-y-auto p-0">
                <SheetHeader className="px-5 pt-5 pb-3 text-left">
                  <SheetTitle className="font-serif text-xl">Filter & Sort</SheetTitle>
                </SheetHeader>

                <div className="px-5 pb-5 space-y-6">
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-muted-foreground mb-3">
                      Collection
                    </p>
                    <div className="flex flex-col">
                      {[{ slug: "all", name: "All Pieces" }, ...collections].map((c) => (
                        <button
                          key={c.slug}
                          onClick={() => handleFilterChange(c.slug)}
                          className={cn(
                            "flex items-center justify-between py-3 border-b border-border text-sm text-left",
                            activeCollection === c.slug && "font-medium text-primary"
                          )}
                        >
                          {c.name}
                          {activeCollection === c.slug && <Check className="w-4 h-4" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-muted-foreground mb-3">
                      Sort by
                    </p>
                    <div className="flex flex-col">
                      {SORT_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleSortChange(option.value)}
                          className={cn(
                            "flex items-center justify-between py-3 border-b border-border text-sm text-left",
                            activeSort === option.value && "font-medium text-primary"
                          )}
                        >
                          {option.label}
                          {activeSort === option.value && <Check className="w-4 h-4" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-1">
                    <Button
                      variant="outline"
                      onClick={() => commit(new URLSearchParams())}
                      disabled={!hasActiveFilters}
                      className="flex-1 rounded-none h-12 text-xs tracking-[0.15em] uppercase"
                    >
                      Reset
                    </Button>
                    <Button
                      onClick={() => setFiltersOpen(false)}
                      className="flex-1 rounded-none h-12 text-xs tracking-[0.15em] uppercase"
                    >
                      Show {products.length}
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Active filter chips (mobile) */}
          {hasActiveFilters && (
            <div className="flex md:hidden gap-2 mt-3 overflow-x-auto scrollbar-hide">
              {activeCollection !== "all" && (
                <button
                  onClick={() => handleFilterChange("all")}
                  className="flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 text-[11px] uppercase tracking-[0.1em] bg-accent text-accent-foreground"
                >
                  {currentCollection?.name}
                  <X className="w-3 h-3" />
                </button>
              )}
              {activeSort !== DEFAULT_SORT && (
                <button
                  onClick={() => handleSortChange(DEFAULT_SORT)}
                  className="flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 text-[11px] uppercase tracking-[0.1em] bg-accent text-accent-foreground"
                >
                  {activeSortLabel}
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {/* Desktop bar */}
          <div className="hidden md:flex items-center justify-between gap-4">
            {/* Collection Filters */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFilterChange("all")}
                className={cn(
                  "rounded-none px-5 whitespace-nowrap text-xs tracking-[0.1em] uppercase transition-all duration-300",
                  activeCollection === "all"
                    ? "bg-foreground text-background hover:bg-foreground/90 hover:text-background"
                    : "hover:bg-accent"
                )}
              >
                All
              </Button>
              {collections.map((collection) => (
                <Button
                  key={collection.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFilterChange(collection.slug)}
                  className={cn(
                    "rounded-none px-5 whitespace-nowrap text-xs tracking-[0.1em] uppercase transition-all duration-300",
                    activeCollection === collection.slug
                      ? "bg-foreground text-background hover:bg-foreground/90 hover:text-background"
                      : "hover:bg-accent"
                  )}
                >
                  {collection.name}
                </Button>
              ))}
            </div>

            {/* Sorting */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground tracking-[0.1em] uppercase whitespace-nowrap">
                Sort by
              </span>
              <Select value={activeSort} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px] rounded-none text-xs tracking-[0.05em] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-xs"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-14 md:py-20">
        <div className="container-full">
          {products.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-10">
                <p className="text-sm text-muted-foreground">
                  {products.length} {products.length === 1 ? "piece" : "pieces"}
                </p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8 md:gap-10">
                {products.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-28">
              <p className="font-serif text-2xl text-muted-foreground mb-4">
                No pieces found
              </p>
              <p className="text-muted-foreground mb-8">
                This collection is currently being curated.
              </p>
              <Button
                asChild
                variant="outline"
                className="rounded-none px-8 text-sm tracking-[0.1em] uppercase"
              >
                <Link href="/products">View All Pieces</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="relative h-[50vh] overflow-hidden">
        <div className="absolute inset-0">
          <Media src={CTA_IMAGE} alt="Interior lifestyle" />
          <div className="absolute inset-0 bg-charcoal/50" />
        </div>
        <div className="relative h-full flex items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-white/50 mb-4">
              Need Assistance?
            </p>
            <h2 className="font-serif text-3xl md:text-5xl text-white mb-6">
              We&apos;re Here to Help
            </h2>
            <Button
              asChild
              size="lg"
              className="rounded-none px-10 py-6 text-sm tracking-[0.15em] uppercase bg-white text-charcoal hover:bg-white/90"
            >
              <a href={`mailto:${site.email}`}>
                Contact Us
                <ArrowRight className="ml-3 w-4 h-4" />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
};
