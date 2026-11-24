"use client";

import type { FC } from "react";
import type { CustomerAccountDataDTO } from "@/models/types/account";
import { useAccountViewModel } from "@/hooks/useAccountViewModel";
import { AccountNav } from "@/components/organisms/Account/AccountNav";
import { AccountProfileSection } from "@/components/organisms/Account/AccountProfileSection";
import { AccountAddressesSection } from "@/components/organisms/Account/AccountAddressesSection";
import { AccountOrdersSection } from "@/components/organisms/Account/AccountOrdersSection";

interface CustomerAccountViewProps {
  initialData: CustomerAccountDataDTO;
}

export const CustomerAccountView: FC<CustomerAccountViewProps> = ({ initialData }) => {
  const {
    activeTab,
    setTab,
    isPending,
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
  } = useAccountViewModel(initialData);

  return (
    <div className="w-full">
      <div className="mb-8 border-b border-line pb-6">
        <p className="eyebrow text-muted">ZCORTÉ CLIENT ACCESS</p>
        <h1 className="mt-2 text-3xl font-light tracking-tight text-black sm:text-4xl">
          Welcome, {initialData.profile.name || "Collector"}
        </h1>
        <p className="mt-1 text-xs text-muted">
          Member since{" "}
          {new Date(initialData.profile.createdAt).toLocaleDateString("id-ID", {
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="mb-8">
        <AccountNav
          activeTab={activeTab}
          onSelectTab={setTab}
          orderCount={initialData.orders.length}
          addressCount={initialData.addresses.length}
        />
      </div>

      <div>
        {activeTab === "orders" && <AccountOrdersSection orders={initialData.orders} />}

        {activeTab === "addresses" && (
          <AccountAddressesSection
            addresses={initialData.addresses}
            isPending={isPending}
            message={addressMessage}
            error={addressError}
            isAddingAddress={isAddingAddress}
            setIsAddingAddress={setIsAddingAddress}
            onCreateAddress={handleCreateAddress}
            onSetDefault={handleSetDefaultAddress}
            onDelete={handleDeleteAddress}
          />
        )}

        {activeTab === "profile" && (
          <AccountProfileSection
            profile={initialData.profile}
            isPending={isPending}
            message={profileMessage}
            error={profileError}
            onUpdate={handleUpdateProfile}
          />
        )}
      </div>
    </div>
  );
};
