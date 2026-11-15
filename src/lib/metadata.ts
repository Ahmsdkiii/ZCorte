import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "./constants";

interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
  image?: string;
}

export function buildPageMetadata({
  title,
  description,
  path,
  image = "/images/apex/campaign-main-0.jpeg",
}: PageMetadataInput): Metadata {
  const canonical = new URL(path, SITE_URL).toString();
  const imageUrl = new URL(image, SITE_URL).toString();
  const socialTitle = `${title} — ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: socialTitle,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: "website",
      images: [{ url: imageUrl, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [imageUrl],
    },
  };
}
