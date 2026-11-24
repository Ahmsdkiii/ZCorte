import Link from "next/link";
import { Icon } from "@/components/atoms/Icon";
import { ProductCollection } from "@/models/types/product";

interface CollectionClosingProps {
  collection: ProductCollection;
  statement: string;
}

export function CollectionClosing({ collection, statement }: CollectionClosingProps) {
  return (
    <section
      data-collection={collection}
      className="border-t border-[var(--cinematic-border,#52595a)] bg-[var(--cinematic-bg)] px-[var(--gutter)] py-20 text-[var(--cinematic-text)] sm:py-28"
    >
      <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <p className="eyebrow mb-4 text-[var(--accent)]">ZCORTÉ / {collection.toUpperCase()}</p>
          <h2 className="max-w-4xl text-4xl font-bold uppercase leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
            {statement}
          </h2>
        </div>
        <div className="lg:col-span-4 lg:justify-self-end">
          <Link
            href="/shop"
            className="inline-flex min-h-11 items-center gap-3 border border-white/40 px-5 text-xs font-semibold uppercase tracking-widest transition-colors hover:bg-white hover:text-black"
          >
            Shop the system
            <Icon name="arrow-up-right" size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
