import { collections } from "@/data/collections";
import { products } from "@/data/products";
import {
  DEFAULT_SORT,
  type Collection,
  type Product,
  type SortOption,
} from "@/types/catalog";

export const getCollections = (): Collection[] => collections;

export const getProducts = (): Product[] => products;

export const getCollectionById = (id: string): Collection | undefined =>
  collections.find((collection) => collection.id === id);

export const getCollectionBySlug = (slug: string): Collection | undefined =>
  collections.find((collection) => collection.slug === slug);

export const getProductBySlug = (slug: string): Product | undefined =>
  products.find((product) => product.slug === slug);

export const getNewProducts = (): Product[] =>
  products.filter((product) => product.new);

export const getRelatedProducts = (productId: string, limit = 4): Product[] => {
  const product = products.find((candidate) => candidate.id === productId);
  if (!product) return [];

  return products
    .filter(
      (candidate) =>
        candidate.collection === product.collection && candidate.id !== productId,
    )
    .slice(0, limit);
};

/**
 * Filters and sorts the catalog for the listing page. `collectionSlug` of
 * `"all"` (or undefined) skips filtering; an unknown slug yields no products.
 */
export const queryProducts = ({
  collectionSlug = "all",
  sort = DEFAULT_SORT,
}: {
  collectionSlug?: string;
  sort?: SortOption;
} = {}): Product[] => {
  let result = [...products];

  if (collectionSlug !== "all") {
    const collection = getCollectionBySlug(collectionSlug);
    result = collection
      ? result.filter((product) => product.collection === collection.id)
      : [];
  }

  switch (sort) {
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "name-asc":
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "newest":
    default:
      result = result
        .filter((product) => product.new)
        .concat(result.filter((product) => !product.new));
      break;
  }

  return result;
};
