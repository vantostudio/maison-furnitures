import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductsView } from "@/components/views/ProductsView";
import {
  getCollectionBySlug,
  getCollections,
  queryProducts,
} from "@/lib/catalog";
import { DEFAULT_SORT, isSortOption } from "@/types/catalog";

export const metadata: Metadata = {
  title: "Shop All",
  description:
    "Browse the full collection of handcrafted lighting, ceramics, furniture, textiles and objects.",
};

interface ProductsPageProps {
  searchParams: Promise<{ collection?: string; sort?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { collection, sort } = await searchParams;

  const activeCollection = collection ?? "all";
  const activeSort = isSortOption(sort) ? sort : DEFAULT_SORT;
  const currentCollection =
    activeCollection === "all" ? null : getCollectionBySlug(activeCollection) ?? null;

  return (
    // ProductsView reads the query string, which needs a Suspense boundary.
    <Suspense fallback={null}>
      <ProductsView
        products={queryProducts({ collectionSlug: activeCollection, sort: activeSort })}
        collections={getCollections()}
        activeCollection={activeCollection}
        activeSort={activeSort}
        currentCollection={currentCollection}
      />
    </Suspense>
  );
}
