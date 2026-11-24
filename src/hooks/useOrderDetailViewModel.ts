"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cancelMyOrderAction, simulateOrderPaymentAction } from "@/actions/order-mutation.actions";

export function useOrderDetailViewModel(orderNumber: string) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("Changed my mind");
  const [customReason, setCustomReason] = useState("");
  const [copiedAwb, setCopiedAwb] = useState(false);

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCancelOrder = () => {
    setMessage(null);
    setError(null);

    const finalReason =
      cancelReason === "Other" ? customReason.trim() || "Cancelled by customer" : cancelReason;

    startTransition(async () => {
      const result = await cancelMyOrderAction({
        orderNumber,
        reason: finalReason,
      });

      if (result.success) {
        setMessage(result.message || "Order cancelled successfully.");
        setIsCancelOpen(false);
        router.refresh();
      } else {
        setError(result.error || "Failed to cancel order.");
      }
    });
  };

  const handleSimulatePayment = () => {
    setMessage(null);
    setError(null);

    startTransition(async () => {
      const result = await simulateOrderPaymentAction(orderNumber);
      if (result.success) {
        setMessage(result.message || "Payment verified.");
        setIsCancelOpen(false);
        router.refresh();
      } else {
        setError(result.error || "Failed to simulate payment.");
      }
    });
  };

  const handleCopyTracking = async (trackingNumber: string) => {
    try {
      await navigator.clipboard.writeText(trackingNumber);
      setCopiedAwb(true);
      window.setTimeout(() => setCopiedAwb(false), 2000);
    } catch {
      setError("Could not copy tracking number to clipboard.");
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return {
    isPending,
    isCancelOpen,
    setIsCancelOpen,
    cancelReason,
    setCancelReason,
    customReason,
    setCustomReason,
    copiedAwb,
    message,
    error,
    handleCancelOrder,
    handleSimulatePayment,
    handleCopyTracking,
    handlePrintInvoice,
  };
}
