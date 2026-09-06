"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Media } from "@/components/media/Media";
import type { Collection } from "@/types/catalog";

interface CollectionCardProps {
  collection: Collection;
  index?: number;
  variant?: "default" | "wide" | "tall";
  /** Override aspect ratio (e.g. for mobile mosaic layouts) */
  aspectClass?: string;
}

export const CollectionCard = ({ collection, index = 0, variant = "default", aspectClass }: CollectionCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: Math.min(index, 4) * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Link
        href={`/products?collection=${collection.slug}`}
        className="group block relative"
      >
        <div
          className={`relative overflow-hidden bg-muted/50 ${
            aspectClass ??
            (variant === "wide" ? "aspect-[16/9]" :
            variant === "tall" ? "aspect-[2/3]" :
            "aspect-[3/4]")
          }`}
        >
          {/* Image with zoom on hover */}
          <Media
            src={collection.image}
            alt={collection.name}
            sizes="(min-width: 768px) 50vw, 100vw"
            className="transition-transform duration-500 ease-out group-hover:scale-110"
          />

          {/* Multi-layer gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent" />
          <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/20 transition-colors duration-500" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-7 md:p-8">
            {/* Collection label */}
            <p className="hidden sm:block text-[10px] font-semibold tracking-[0.25em] uppercase text-white/60 mb-2 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
              Collection
            </p>

            {/* Title */}
            <h3 className="font-serif text-lg sm:text-2xl md:text-3xl text-white mb-1 sm:mb-2 transform group-hover:-translate-y-1 transition-transform duration-500">
              {collection.name}
            </h3>

            {/* Description with reveal */}
            <p className="hidden sm:block text-sm text-white/70 leading-relaxed max-w-xs transform translate-y-1 group-hover:translate-y-0 transition-transform duration-500 delay-75 line-clamp-2">
              {collection.description}
            </p>

            {/* Arrow indicator — always visible on mobile (no hover) */}
            <div className="flex items-center gap-1.5 sm:gap-2 mt-2 sm:mt-4 opacity-100 translate-y-0 sm:opacity-0 sm:translate-y-4 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 transition-all duration-500 delay-150">
              <span className="text-[10px] sm:text-xs font-medium tracking-[0.15em] uppercase text-white/90">
                Explore
              </span>
              <ArrowRight className="w-4 h-4 text-white/90 transform group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>

          {/* Top border accent on hover */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/40 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-10" />
        </div>
      </Link>
    </motion.article>
  );
};
