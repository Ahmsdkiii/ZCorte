"use client";

import React from "react";
import { Product } from "@/models/types/product";
import { AccordionItem } from "@/components/molecules/AccordionItem";

export interface ProductAccordionSectionProps {
  product: Product;
}

export function ProductAccordionSection({ product }: ProductAccordionSectionProps) {
  return (
    <div className="mt-8 border-b border-line">
      <AccordionItem title="SPECIFICATIONS" defaultOpen>
        <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {Object.entries(product.specifications).map(([k, v]) => (
            <div key={k}>
              <dt className="eyebrow text-muted">{k}</dt>
              <dd className="mt-0.5 text-xs text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </AccordionItem>

      <AccordionItem title="MATERIALS & CARE">
        <p className="text-xs leading-relaxed text-muted">
          {product.specifications.materials ||
            "Engineered technical fabrics. Machine wash cold with like colors. Do not bleach. Tumble dry low or hang dry. Do not iron directly on technical prints."}
        </p>
      </AccordionItem>

      <AccordionItem title="SHIPPING & RETURNS">
        <p className="text-xs leading-relaxed text-muted">
          Complimentary standard shipping on all orders. Express delivery available at checkout.
          30-day return policy for unworn items in original packaging with tags attached.
        </p>
      </AccordionItem>
    </div>
  );
}
