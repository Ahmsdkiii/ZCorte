import { requireUser } from "@/server/auth/guards";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { CartDrawer } from "@/components/compound/CartDrawer";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  await requireUser();

  return (
    <>
      <Header />
      <div className="flex flex-1 flex-col pt-24 pb-16">
        <main id="main" className="mx-auto w-full max-w-6xl px-gutter">
          {children}
        </main>
      </div>
      <Footer />
      <CartDrawer />
    </>
  );
}
