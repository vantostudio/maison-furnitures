import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailView } from "@/components/views/ProductDetailView";
import {
  getCollectionById,
  getProductBySlug,
  getProducts,
  getRelatedProducts,
} from "@/lib/catalog";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

/** The catalog is static, so every detail page is prerendered at build time. */
export function generateStaticParams() {
  return getProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) return { title: "Product Not Found" };

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.images[0] }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  return (
    <ProductDetailView
      product={product}
      collection={getCollectionById(product.collection) ?? null}
      relatedProducts={getRelatedProducts(product.id)}
    />
  );
}
