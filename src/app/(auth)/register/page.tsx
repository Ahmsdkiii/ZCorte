import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthSplitLayout } from "@/components/organisms/Auth/AuthSplitLayout";
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <AuthSplitLayout
        image="/images/apex/campaign-outdoor-mist.jpeg"
        imageAlt="ZCorté outdoor collection in alpine mist"
        eyebrow="ZCORTÉ / MEMBERSHIP"
        headline="The journey begins here."
      >
        <Suspense fallback={<div className="min-h-[300px]" aria-hidden="true" />}>
          <RegisterForm />
        </Suspense>
      </AuthSplitLayout>
    </>
  );
}
