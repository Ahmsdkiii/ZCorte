import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { CartDrawer } from "@/components/compound/CartDrawer";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer />
      <CartDrawer />
    </>
  );
}
