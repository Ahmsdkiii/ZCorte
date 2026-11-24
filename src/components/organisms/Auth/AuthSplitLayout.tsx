import Image from "next/image";
import Link from "next/link";

interface AuthSplitLayoutProps {
  image: string;
  imageAlt: string;
  eyebrow: string;
  headline: string;
  children: React.ReactNode;
}

export function AuthSplitLayout({
  image,
  imageAlt,
  eyebrow,
  headline,
  children,
}: AuthSplitLayoutProps) {
  return (
    <main id="main" className="grid min-h-dvh w-full grid-cols-1 md:grid-cols-2">
      <section
        aria-label="ZCorté editorial"
        className="theme-cinematic relative hidden overflow-hidden bg-cinematic-bg md:block"
      >
        <Image src={image} alt={imageAlt} fill priority sizes="50vw" className="object-cover" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10"
        />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-8 lg:p-12">
          <Link
            href="/"
            className="font-display text-[18px] font-bold tracking-[0.18em] text-white uppercase"
          >
            ZCORTÉ
          </Link>
          <span className="text-[9px] tracking-[0.14em] text-white/70 uppercase">
            Bandung — Est. 2026
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-8 lg:p-12">
          <p className="eyebrow mb-5 text-white/70">{eyebrow}</p>
          <h2 className="max-w-[12ch] text-[clamp(40px,4.6vw,76px)] leading-[0.92] tracking-[-0.04em] text-white uppercase">
            {headline}
          </h2>
          <p className="mt-6 border-t border-white/25 pt-5 text-[11px] tracking-[0.04em] text-white/70">
            Crafted in Bandung, West Java &middot; Small-batch technical apparel
          </p>
        </div>
      </section>

      <section className="flex min-h-dvh flex-col bg-surface">
        <div className="flex items-center justify-between px-6 py-6 md:px-10 lg:px-14">
          <Link
            href="/"
            className="font-display text-[16px] font-bold tracking-[0.18em] text-ink uppercase md:invisible"
          >
            ZCORTÉ
          </Link>
          <Link
            href="/"
            className="text-[10px] tracking-[0.12em] text-muted uppercase transition-colors hover:text-ink"
          >
            ← Back to store
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center px-6 pb-12 md:px-10 lg:px-14">
          <div className="w-full max-w-[420px]">{children}</div>
        </div>
      </section>
    </main>
  );
}
