import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/organisms/Auth/LoginForm";
import { buildPageMetadata } from "@/lib/metadata";
import { generateBreadcrumbSchema } from "@/lib/jsonLd";

export const metadata: Metadata = buildPageMetadata({
  title: "Sign In — ZCorté Client Access",
  description: "Sign in to your ZCorté account to access orders, bag, and client preferences.",
  path: "/login",
});

export default function LoginPage() {
  const breadcrumbJsonLd = generateBreadcrumbSchema([
    { name: "ZCorté", url: "/" },
    { name: "Sign In", url: "/login" },
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
        <LoginForm />
      </Suspense>
    </main>
  );
}
