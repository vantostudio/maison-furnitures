"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowDown, Instagram } from "lucide-react";
import { useRef } from "react";
import { ProductCard } from "@/components/commerce/ProductCard";
import { CollectionCard } from "@/components/commerce/CollectionCard";
import { Media } from "@/components/media/Media";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";
import type { Collection, Product } from "@/types/catalog";

/** Editorial imagery for the social strip — decorative, not part of the catalog. */
const INSTAGRAM_IMAGES = [
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=80",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80",
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80",
  "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&q=80",
  "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400&q=80",
];

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=80";

interface HomeViewProps {
  latestProducts: Product[];
  displayedCollections: Collection[];
  featuredCollection: Collection;
}

export const HomeView = ({
  latestProducts,
  displayedCollections,
  featuredCollection,
}: HomeViewProps) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroImageY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <>
      {/* Hero Section — Full Viewport */}
      <section ref={heroRef} className="relative h-[100svh] -mt-16 md:-mt-20 overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: heroImageY }}>
          <div className="relative w-full h-[120%]">
            <Media
              src={HERO_IMAGE}
              alt="Curated home lifestyle"
              priority
              className="animate-ken-burns"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/30 via-charcoal/10 to-charcoal/50" />
        </motion.div>

        <motion.div
          className="relative container-full h-full flex flex-col justify-end pb-20 md:pb-28 pt-16 md:pt-20"
          style={{ opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            className="max-w-3xl"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-[11px] font-semibold tracking-[0.3em] uppercase text-white/70 mb-6"
            >
              Curated for Considered Living
            </motion.p>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl text-white mb-6 sm:mb-8 leading-[0.9] tracking-tight">
              Objects of
              <br />
              <span className="italic font-normal">Quiet Beauty</span>
            </h1>
            <p className="text-base md:text-lg text-white/80 mb-10 leading-relaxed max-w-lg">
              Handcrafted home goods and lifestyle pieces designed to bring
              warmth and intention to everyday moments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-none px-10 py-6 text-sm tracking-[0.15em] uppercase btn-premium"
              >
                <Link href="/products">
                  Shop Now
                  <ArrowRight className="ml-3 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-[10px] tracking-[0.3em] uppercase text-white/50">Scroll</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowDown className="w-4 h-4 text-white/50" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Collection */}
      <section className="py-20 md:py-28">
        <div className="container-full">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }}
              className="relative aspect-[4/5] overflow-hidden group"
            >
              <Media
                src={featuredCollection.heroImage || featuredCollection.image}
                alt={featuredCollection.name}
                sizes="(min-width: 768px) 50vw, 100vw"
                className="transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] as const }}
              className="md:py-12"
            >
              <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-primary mb-4">
                Featured Collection
              </p>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 leading-[0.95]">
                {featuredCollection.name}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8 max-w-md">
                {featuredCollection.description}. Discover sculptural forms that cast warmth and shadow,
                designed to transform any space into a sanctuary of light.
              </p>
              <Button
                asChild
                size="lg"
                className="rounded-none px-10 py-6 text-sm tracking-[0.15em] uppercase btn-premium"
              >
                <Link href={`/products?collection=${featuredCollection.slug}`}>
                  Shop {featuredCollection.name}
                  <ArrowRight className="ml-3 w-4 h-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Latest Products */}
      <section className="py-20 md:py-28 bg-linen">
        <div className="container-full">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 md:mb-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-primary mb-3">
                Just Arrived
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground">
                Latest Products
              </h2>
            </motion.div>
            <Link
              href="/products"
              className="hidden md:flex items-center gap-3 text-sm font-medium tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground transition-colors group"
            >
              View All
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 md:gap-10">
            {latestProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>

          <div className="mt-14 text-center md:hidden">
            <Button
              asChild
              variant="outline"
              className="rounded-none px-8 py-5 text-sm tracking-[0.15em] uppercase"
            >
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-24 md:py-32">
        <div className="container-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-primary mb-3">
              Browse By
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground">
              Collections
            </h2>
          </motion.div>

          {/* Asymmetric grid — 2-col mosaic on mobile, 12-col editorial on md+ */}
          <div className="grid grid-cols-2 md:grid-cols-12 gap-3 sm:gap-4 md:gap-6">
            {/* Hero tile — full width */}
            <div className="col-span-2 md:col-span-7 md:order-1">
              <CollectionCard
                collection={displayedCollections[0]}
                index={0}
                aspectClass="aspect-[16/10] md:aspect-[16/9]"
              />
            </div>

            {/* Pair of squares */}
            <div className="col-span-1 md:col-span-5 md:order-2">
              <CollectionCard
                collection={displayedCollections[1]}
                index={1}
                aspectClass="aspect-[3/4]"
              />
            </div>
            <div className="col-span-1 md:col-span-4 md:order-4">
              <CollectionCard
                collection={displayedCollections[2]}
                index={2}
                aspectClass="aspect-[3/4]"
              />
            </div>

            {/* Wide banner — full width on mobile */}
            <div className="col-span-2 md:col-span-4 md:order-3">
              <CollectionCard
                collection={displayedCollections[3]}
                index={3}
                aspectClass="aspect-[16/9] md:aspect-[3/4]"
              />
            </div>

            {/* Pair of squares */}
            <div className="col-span-1 md:col-span-4 md:order-5">
              <CollectionCard
                collection={displayedCollections[4]}
                index={4}
                aspectClass="aspect-[3/4]"
              />
            </div>
            <div className="col-span-1 md:col-span-12 md:order-6">
              <CollectionCard
                collection={displayedCollections[5]}
                index={5}
                aspectClass="aspect-[3/4] md:aspect-[16/9]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-24 md:py-32 bg-linen">
        <div className="container-narrow text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          >
            <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-primary mb-6">
              About Us
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground leading-[1.3] mb-8">
              We believe in the beauty of slow living—in objects made with care,
              materials that age gracefully, and spaces that invite{" "}
              <span className="italic">pause</span>.
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
              Every piece in our collection is selected for its material integrity,
              its maker&apos;s story, and its ability to endure beautifully. We work with
              artisans who share our commitment to craft and sustainability.
            </p>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-none px-10 py-6 text-sm tracking-[0.15em] uppercase"
            >
              <Link href="/about">
                Read Our Story
                <ArrowRight className="ml-3 w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Follow Us / Instagram Section */}
      <section className="py-20 md:py-28">
        <div className="container-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-primary mb-3">
              Follow Us
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
              {site.instagram.handle}
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Join our community and get inspired by curated spaces and behind-the-scenes moments.
            </p>
          </motion.div>

          {/* Instagram Grid */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4">
            {INSTAGRAM_IMAGES.map((image, index) => (
              <motion.a
                key={image}
                href={site.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: Math.min(index, 4) * 0.05 }}
                className="relative aspect-square overflow-hidden group cursor-pointer"
              >
                <Media
                  src={image}
                  alt="Instagram post"
                  sizes="(min-width: 768px) 16vw, 33vw"
                  className="transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/40 transition-colors duration-300 flex items-center justify-center">
                  <Instagram className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
