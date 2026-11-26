import { Role } from "@prisma/client";
import { requireRole } from "@/server/auth/guards";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole(Role.OWNER);

  return <>{children}</>;
}
