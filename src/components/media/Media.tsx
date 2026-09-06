import Image from "next/image";
import { cn } from "@/lib/utils";

interface MediaProps {
  src: string;
  alt: string;
  /** Extra classes for the image itself — transitions, animations, object-position. */
  className?: string;
  /**
   * Responsive width hint for the optimizer. Defaults to full-viewport, which
   * is only correct for edge-to-edge imagery — pass a narrower value for grids.
   */
  sizes?: string;
  priority?: boolean;
}

/**
 * Every image in the catalog is remote and fills a container whose size comes
 * from the layout (an aspect ratio or an explicit height), so `fill` plus
 * `object-cover` is the shared case. The parent must be positioned.
 */
export const Media = ({
  src,
  alt,
  className,
  sizes = "100vw",
  priority = false,
}: MediaProps) => (
  <Image
    src={src}
    alt={alt}
    fill
    sizes={sizes}
    priority={priority}
    className={cn("object-cover", className)}
  />
);
