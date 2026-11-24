import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterForm } from "@/components/organisms/Auth/RegisterForm";
import { buildPageMetadata } from "@/lib/metadata";
import { generateBreadcrumbSchema } from "@/lib/jsonLd";

export const metadata: Metadata = buildPageMetadata({
  title: "Create Account — ZCorté Membership",
  description:
    "Register for a ZCorté account to explore small-batch technical apparel collections.",
  path: "/register",
});

export default function RegisterPage() {
  const breadcrumbJsonLd = generateBreadcrumbSchema([
    { name: "ZCorté", url: "/" },
    { name: "Create Account", url: "/register" },
  ]);

  return (
    <main
      id="main"
      className="w-full flex-1 px-gutter pt-[calc(var(--header-height)+48px)] pb-[70px] md:pt-[calc(var(--header-height)+72px)] md:pb-[120px]"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Suspense fallback={<div className="min-h-[300px]" aria-hidden="true" />}>
        <RegisterForm />
      </Suspense>
    </main>
  );
}
