"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export const NotFoundView = () => (
  <section className="py-20 md:py-28">
    <div className="container-narrow text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-8xl font-serif text-muted-foreground/30 mb-4">404</p>
        <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
          Page Not Found
        </h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="rounded-sm">
            <Link href="/">Return Home</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-sm">
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  </section>
);
