"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { CustomerAccountDataDTO } from "@/models/types/account";
import { updateProfileAction } from "@/actions/account.actions";
import {
  createAddressAction,
  setDefaultAddressAction,
  deleteAddressAction,
} from "@/actions/address.actions";

export type AccountTab = "profile" | "addresses" | "orders";

export function useAccountViewModel(initialData: CustomerAccountDataDTO) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = (searchParams.get("tab") as AccountTab) || "orders";

  const [activeTab, setActiveTab] = useState<AccountTab>(currentTab);
  const [isPending, startTransition] = useTransition();
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [addressMessage, setAddressMessage] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const setTab = (tab: AccountTab) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`/account?${params.toString()}`, { scroll: false });
  };

  const handleUpdateProfile = async (formData: {
    name: string;
    phone?: string;
    personalizationOptIn?: boolean;
  }) => {
    setProfileMessage(null);
    setProfileError(null);

    startTransition(async () => {
      const result = await updateProfileAction(formData);
      if (result.success) {
        setProfileMessage(result.message || "Profile updated.");
        router.refresh();
      } else {
        setProfileError(result.error || "Failed to update profile.");
      }
    });
  };

  const handleCreateAddress = async (data: {
    recipientName: string;
    phone: string;
    street: string;
    apartment?: string;
    city: string;
    province: string;
    postalCode: string;
    isDefault?: boolean;
  }) => {
    setAddressMessage(null);
    setAddressError(null);

    startTransition(async () => {
      const result = await createAddressAction(data);
      if (result.success) {
        setAddressMessage(result.message || "Address created.");
        setIsAddingAddress(false);
        router.refresh();
      } else {
        setAddressError(result.error || "Failed to add address.");
      }
    });
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    setAddressMessage(null);
    setAddressError(null);

    startTransition(async () => {
      const result = await setDefaultAddressAction(addressId);
      if (result.success) {
        router.refresh();
      } else {
        setAddressError(result.error || "Failed to set default.");
      }
    });
  };

  const handleDeleteAddress = async (addressId: string) => {
    setAddressMessage(null);
    setAddressError(null);

    startTransition(async () => {
      const result = await deleteAddressAction(addressId);
      if (result.success) {
        router.refresh();
      } else {
        setAddressError(result.error || "Failed to remove address.");
      }
    });
  };

  return {
    activeTab,
    setTab,
    isPending,
    initialData,
    profileMessage,
    profileError,
    addressMessage,
    addressError,
    isAddingAddress,
    setIsAddingAddress,
    handleUpdateProfile,
    handleCreateAddress,
    handleSetDefaultAddress,
    handleDeleteAddress,
  };
}
