import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/lib/metadata";
import { getOrderDetailAction } from "@/actions/order-detail.actions";
import { OrderDetailView } from "@/components/organisms/OrderDetail/OrderDetailView";

interface OrderDetailPageProps {
  params: Promise<{ orderNumber: string }>;
}

export async function generateMetadata({ params }: OrderDetailPageProps): Promise<Metadata> {
  const { orderNumber } = await params;
  return buildPageMetadata({
    title: `Order #${orderNumber} — Digital Invoice & Tracking`,
    description: "Inspect your official ZCorté digital invoice and real-time expedition timeline.",
    path: `/account/orders/${orderNumber}`,
  });
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { orderNumber } = await params;
  const result = await getOrderDetailAction(orderNumber);

  if (!result.success || !result.data) {
    notFound();
  }

  return <OrderDetailView order={result.data} />;
}
