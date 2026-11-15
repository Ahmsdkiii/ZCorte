import type { Metadata } from "next";
import { CheckoutView } from "@/components/organisms/CheckoutView";
import { buildPageMetadata } from "@/lib/metadata";
import { generateBreadcrumbSchema } from "@/lib/jsonLd";

export const metadata: Metadata = buildPageMetadata({
  title: "Checkout — Equipment Dispatch",
  description:
    "Complete your simulated APEX equipment order. Configure dispatch coordinates, courier tier, and settlement channel.",
  path: "/checkout",
});

export default function CheckoutPage() {
  const breadcrumbJsonLd = generateBreadcrumbSchema([
    { name: "APEX", url: "/" },
    { name: "Shop", url: "/shop" },
    { name: "Checkout", url: "/checkout" },
  ]);

  return (
    <main
      id="main"
      className="w-full flex-1 px-gutter pt-[calc(var(--header-height)+36px)] pb-[70px] md:pt-[calc(var(--header-height)+56px)] md:pb-[120px]"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <CheckoutView />
    </main>
  );
}

