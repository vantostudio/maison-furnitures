import { describe, it, expect, beforeEach } from "vitest";
import { MAX_QUANTITY_PER_ITEM, useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { getProductBySlug } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

const lamp = getProductBySlug("orb-table-lamp")!;
const vase = getProductBySlug("sculptural-bud-vase")!;

describe("useCart", () => {
  beforeEach(() => {
    useCart.getState().clearCart();
  });

  it("adds an item and counts it", () => {
    useCart.getState().addItem(lamp);
    expect(useCart.getState().items).toHaveLength(1);
    expect(useCart.getState().getItemCount()).toBe(1);
  });

  it("merges a repeat add into the existing line", () => {
    useCart.getState().addItem(lamp, 2);
    useCart.getState().addItem(lamp, 3);
    expect(useCart.getState().items).toHaveLength(1);
    expect(useCart.getState().items[0].quantity).toBe(5);
  });

  it("caps quantity when adding and when setting directly", () => {
    useCart.getState().addItem(lamp, MAX_QUANTITY_PER_ITEM);
    useCart.getState().addItem(lamp, 5);
    expect(useCart.getState().items[0].quantity).toBe(MAX_QUANTITY_PER_ITEM);

    useCart.getState().updateQuantity(lamp.id, 99);
    expect(useCart.getState().items[0].quantity).toBe(MAX_QUANTITY_PER_ITEM);
  });

  it("removes the line when quantity drops below one", () => {
    useCart.getState().addItem(lamp);
    useCart.getState().updateQuantity(lamp.id, 0);
    expect(useCart.getState().items).toHaveLength(0);
  });

  it("subtotals across lines and quantities", () => {
    useCart.getState().addItem(lamp, 2);
    useCart.getState().addItem(vase, 3);
    expect(useCart.getState().getSubtotal()).toBe(lamp.price * 2 + vase.price * 3);
    expect(useCart.getState().getItemCount()).toBe(5);
  });

  it("empties on clear", () => {
    useCart.getState().addItem(lamp);
    useCart.getState().clearCart();
    expect(useCart.getState().items).toEqual([]);
    expect(useCart.getState().getSubtotal()).toBe(0);
  });
});

describe("useWishlist", () => {
  beforeEach(() => {
    useWishlist.getState().clearWishlist();
  });

  it("saves an item once, however many times it is added", () => {
    useWishlist.getState().addItem(lamp);
    useWishlist.getState().addItem(lamp);
    expect(useWishlist.getState().items).toHaveLength(1);
    expect(useWishlist.getState().isInWishlist(lamp.id)).toBe(true);
  });

  it("removes an item", () => {
    useWishlist.getState().addItem(lamp);
    useWishlist.getState().removeItem(lamp.id);
    expect(useWishlist.getState().isInWishlist(lamp.id)).toBe(false);
  });
});

describe("formatPrice", () => {
  it("renders a currency-prefixed, grouped amount", () => {
    expect(formatPrice(0)).toBe("$0");
    expect(formatPrice(485)).toBe("$485");
    expect(formatPrice(2850)).toBe("$2,850");
  });
});
