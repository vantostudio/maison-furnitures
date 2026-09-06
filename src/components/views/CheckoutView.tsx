"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, AlertCircle } from "lucide-react";
import { Media } from "@/components/media/Media";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  country: "",
  notes: "",
};

const FIELD_CLASS = "rounded-none h-12";
const LABEL_CLASS =
  "block text-xs font-semibold tracking-[0.1em] uppercase text-muted-foreground mb-2";

export const CheckoutView = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { items, getSubtotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const subtotal = getSubtotal();
  const shipping = subtotal > site.freeShippingThreshold ? 0 : site.shippingFee;
  const total = subtotal + shipping;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // No order backend yet — the request is acknowledged locally.
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Order Request Submitted",
      description:
        "Thank you! We'll contact you shortly to complete your order.",
    });

    clearCart();
    setIsSubmitting(false);
    router.push("/");
  };

  if (items.length === 0) {
    return (
      <div className="container-narrow py-28 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-serif text-4xl mb-4">No Items to Checkout</h1>
          <p className="text-muted-foreground mb-8">
            Your bag is empty. Add some items before checking out.
          </p>
          <Button
            asChild
            size="lg"
            className="rounded-none px-10 py-6 text-sm tracking-[0.15em] uppercase btn-premium"
          >
            <Link href="/products">
              Start Shopping
              <ArrowRight className="ml-3 w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="container-full py-6 border-b border-border">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Link href="/cart" className="hover:text-foreground transition-colors">
            Your Bag
          </Link>
          <span className="text-border">/</span>
          <span className="text-foreground">Checkout</span>
        </div>
      </div>

      {/* Coming Soon Banner */}
      <div className="bg-primary/5 border-b border-primary/10">
        <div className="container-full py-4">
          <div className="flex items-start gap-3 text-sm">
            <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p>
              <span className="font-medium">Online checkout coming soon.</span>{" "}
              <span className="text-muted-foreground">
                Please submit your order request below and we&apos;ll contact you to
                complete your purchase.
              </span>
            </p>
          </div>
        </div>
      </div>

      <section className="py-10 md:py-16">
        <div className="container-full">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl mb-8 md:mb-12"
          >
            Checkout
          </motion.h1>

          <div className="grid lg:grid-cols-12 gap-10 md:gap-12 lg:gap-16">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-7"
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Contact Information */}
                <div>
                  <h2 className="font-serif text-xl mb-6">
                    Contact Information
                  </h2>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label htmlFor="firstName" className={LABEL_CLASS}>
                        First Name *
                      </label>
                      <Input
                        id="firstName"
                        name="firstName"
                        autoComplete="given-name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className={FIELD_CLASS}
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className={LABEL_CLASS}>
                        Last Name *
                      </label>
                      <Input
                        id="lastName"
                        name="lastName"
                        autoComplete="family-name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className={FIELD_CLASS}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4">
                    <div>
                      <label htmlFor="email" className={LABEL_CLASS}>
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className={FIELD_CLASS}
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className={LABEL_CLASS}>
                        Phone
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={FIELD_CLASS}
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h2 className="font-serif text-xl mb-6">Shipping Address</h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="address" className={LABEL_CLASS}>
                        Street Address *
                      </label>
                      <Input
                        id="address"
                        name="address"
                        autoComplete="street-address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className={FIELD_CLASS}
                      />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                      <div>
                        <label htmlFor="city" className={LABEL_CLASS}>
                          City *
                        </label>
                        <Input
                          id="city"
                          name="city"
                          autoComplete="address-level2"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className={FIELD_CLASS}
                        />
                      </div>
                      <div>
                        <label htmlFor="postalCode" className={LABEL_CLASS}>
                          Postal Code *
                        </label>
                        <Input
                          id="postalCode"
                          name="postalCode"
                          autoComplete="postal-code"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          required
                          className={FIELD_CLASS}
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label htmlFor="country" className={LABEL_CLASS}>
                          Country *
                        </label>
                        <Input
                          id="country"
                          name="country"
                          autoComplete="country-name"
                          value={formData.country}
                          onChange={handleInputChange}
                          required
                          className={FIELD_CLASS}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Notes */}
                <div>
                  <h2 className="font-serif text-xl mb-6">Order Notes</h2>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Any special requests or notes for your order..."
                    className="rounded-none min-h-[120px]"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full rounded-none py-6 text-sm tracking-[0.15em] uppercase btn-premium"
                >
                  {isSubmitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      Submit Order Request
                      <ArrowRight className="ml-3 w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-5"
            >
              <div className="bg-linen p-6 sm:p-8 lg:sticky lg:top-28">
                <h2 className="font-serif text-xl sm:text-2xl mb-6">Order Summary</h2>

                {/* Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-4">
                      <div className="relative w-16 h-20 bg-muted/30 overflow-hidden flex-shrink-0">
                        <Media
                          src={item.product.images[0]}
                          alt={item.product.name}
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium line-clamp-1">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm mt-1">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>
                      {shipping === 0 ? "Complimentary" : formatPrice(shipping)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between font-serif text-xl">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="mt-8 pt-6 border-t border-border">
                  <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-muted-foreground/60 mb-3">
                    Questions?
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Email us at{" "}
                    <a
                      href={`mailto:${site.email}`}
                      className="text-foreground underline"
                    >
                      {site.email}
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};
