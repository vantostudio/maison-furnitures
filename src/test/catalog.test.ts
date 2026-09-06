import { describe, it, expect } from "vitest";
import {
  getCollectionById,
  getCollectionBySlug,
  getNewProducts,
  getProductBySlug,
  getProducts,
  getRelatedProducts,
  queryProducts,
} from "@/lib/catalog";
import { getCollections } from "@/lib/catalog";

describe("catalog integrity", () => {
  it("gives every product a unique id and slug", () => {
    const products = getProducts();
    expect(new Set(products.map((p) => p.id)).size).toBe(products.length);
    expect(new Set(products.map((p) => p.slug)).size).toBe(products.length);
  });

  it("points every product at a collection that exists", () => {
    for (const product of getProducts()) {
      expect(getCollectionById(product.collection), product.slug).toBeDefined();
    }
  });

  it("gives every product at least one image", () => {
    for (const product of getProducts()) {
      expect(product.images.length, product.slug).toBeGreaterThan(0);
    }
  });
});

describe("lookups", () => {
  it("finds a product by slug and misses unknown ones", () => {
    expect(getProductBySlug("arc-pendant-light")?.name).toBe("Arc Pendant Light");
    expect(getProductBySlug("no-such-product")).toBeUndefined();
  });

  it("finds a collection by slug", () => {
    expect(getCollectionBySlug("lighting")?.id).toBe("lighting");
    expect(getCollectionBySlug("no-such-collection")).toBeUndefined();
  });

  it("returns only products flagged new", () => {
    expect(getNewProducts().every((p) => p.new)).toBe(true);
  });
});

describe("getRelatedProducts", () => {
  it("returns same-collection products excluding the subject", () => {
    const product = getProductBySlug("arc-pendant-light")!;
    const related = getRelatedProducts(product.id);

    expect(related.length).toBeGreaterThan(0);
    expect(related.every((p) => p.collection === product.collection)).toBe(true);
    expect(related.some((p) => p.id === product.id)).toBe(false);
  });

  it("returns nothing for an unknown product", () => {
    expect(getRelatedProducts("no-such-id")).toEqual([]);
  });
});

describe("queryProducts", () => {
  it("returns the whole catalog by default", () => {
    expect(queryProducts()).toHaveLength(getProducts().length);
  });

  it("filters to a collection", () => {
    const lighting = queryProducts({ collectionSlug: "lighting" });
    expect(lighting.length).toBeGreaterThan(0);
    expect(lighting.every((p) => p.collection === "lighting")).toBe(true);
  });

  it("returns nothing for an unknown collection slug", () => {
    expect(queryProducts({ collectionSlug: "no-such-collection" })).toEqual([]);
  });

  it("sorts by price ascending and descending", () => {
    const asc = queryProducts({ sort: "price-asc" }).map((p) => p.price);
    expect(asc).toEqual([...asc].sort((a, b) => a - b));

    const desc = queryProducts({ sort: "price-desc" }).map((p) => p.price);
    expect(desc).toEqual([...desc].sort((a, b) => b - a));
  });

  it("sorts alphabetically", () => {
    const names = queryProducts({ sort: "name-asc" }).map((p) => p.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  it("puts new arrivals first under the default sort", () => {
    const flags = queryProducts({ sort: "newest" }).map((p) => Boolean(p.new));
    expect(flags.indexOf(false)).toBeGreaterThan(flags.lastIndexOf(true));
  });

  it("does not mutate the underlying catalog", () => {
    const before = getProducts().map((p) => p.id);
    queryProducts({ sort: "price-desc" });
    expect(getProducts().map((p) => p.id)).toEqual(before);
  });
});

describe("collections", () => {
  it("gives every collection a unique slug", () => {
    const slugs = getCollections().map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
