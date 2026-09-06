/** Single source of truth for brand strings used across metadata and the UI. */
export const site = {
  name: "Rowan & Ash",
  tagline: "Curated home objects and lifestyle pieces for considered living.",
  description:
    "Handcrafted home goods and lifestyle pieces designed to bring warmth and intention to everyday moments.",
  email: "hello@rowanandash.com",
  instagram: {
    handle: "@rowanandash",
    url: "https://instagram.com",
  },
  /** Orders above this subtotal ship free; below it, `shippingFee` applies. */
  freeShippingThreshold: 500,
  shippingFee: 25,
} as const;

/** Vercel sets VERCEL_URL on every deployment, so this needs no configuration. */
export const siteUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";
