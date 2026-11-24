import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { getSession } from "@/server/auth/session";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect("/login?callbackUrl=/admin");
  }

  if (session.role !== Role.OWNER) {
    redirect("/account");
  }

  return <>{children}</>;
}
