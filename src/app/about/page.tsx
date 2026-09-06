import type { Metadata } from "next";
import { AboutView } from "@/components/views/AboutView";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Objects made with care, materials that age gracefully, and spaces that invite pause.",
};

export default function AboutPage() {
  return <AboutView />;
}
