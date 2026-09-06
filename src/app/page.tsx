import { HomeView } from "@/components/views/HomeView";
import { getCollections, getProducts } from "@/lib/catalog";

export default function HomePage() {
  const collections = getCollections();
  const products = getProducts();

  return (
    <HomeView
      latestProducts={products.slice(0, 4)}
      displayedCollections={collections.slice(0, 6)}
      featuredCollection={collections[0]}
    />
  );
}
