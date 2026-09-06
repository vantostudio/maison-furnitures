import type { Metadata } from "next";
import { FavoritesView } from "@/components/views/FavoritesView";
import { getCollections } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Favorites",
  robots: { index: false },
};

export default function FavoritesPage() {
  return <FavoritesView collections={getCollections()} />;
}
