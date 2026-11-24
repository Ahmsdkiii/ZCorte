import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { buildPageMetadata } from "@/lib/metadata";
import { getAccountDataAction } from "@/actions/account.actions";
import { CustomerAccountView } from "@/components/organisms/Account/CustomerAccountView";

export const metadata: Metadata = buildPageMetadata({
  title: "My Account — Client Portal",
  description:
    "Manage your ZCorté client profile, saved delivery addresses, and personal order history.",
  path: "/account",
});

export default async function AccountPage() {
  const result = await getAccountDataAction();

  if (!result.success || !result.data) {
    redirect("/login?callbackUrl=/account");
  }

  return <CustomerAccountView initialData={result.data} />;
}
