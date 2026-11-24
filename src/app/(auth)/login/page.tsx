import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthSplitLayout } from "@/components/organisms/Auth/AuthSplitLayout";
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <AuthSplitLayout
        image="/images/apex/campaign-main-1.jpeg"
        imageAlt="ZCorté editorial campaign in a volcanic landscape"
        eyebrow="ZCORTÉ / CLIENT ACCESS"
        headline="Welcome back."
      >
        <Suspense fallback={<div className="min-h-[300px]" aria-hidden="true" />}>
          <LoginForm />
        </Suspense>
      </AuthSplitLayout>
    </>
  );
}
