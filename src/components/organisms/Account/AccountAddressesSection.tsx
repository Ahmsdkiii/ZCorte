"use client";

import { useState } from "react";
import type { FC, FormEvent } from "react";
import type { AddressDTO } from "@/models/types/account";
import { AddressCreateForm } from "@/components/organisms/Account/AddressCreateForm";

interface AccountAddressesSectionProps {
  addresses: AddressDTO[];
  isPending: boolean;
  message: string | null;
  error: string | null;
  isAddingAddress: boolean;
  setIsAddingAddress: (open: boolean) => void;
  onCreateAddress: (data: {
    recipientName: string;
    phone: string;
    street: string;
    apartment?: string;
    city: string;
    province: string;
    postalCode: string;
    isDefault?: boolean;
  }) => void;
  onSetDefault: (id: string) => void;
  onDelete: (id: string) => void;
}

export const AccountAddressesSection: FC<AccountAddressesSectionProps> = ({
  addresses,
  isPending,
  message,
  error,
  isAddingAddress,
  setIsAddingAddress,
  onCreateAddress,
  onSetDefault,
  onDelete,
}) => {
  const [recipientName, setRecipientName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onCreateAddress({
      recipientName,
      phone,
      street,
      apartment,
      city,
      province,
      postalCode,
      isDefault,
    });
  };

  return (
    <section aria-labelledby="addresses-heading">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 id="addresses-heading" className="text-xl font-medium tracking-tight">
            Saved Addresses
          </h2>
          <p className="mt-1 text-xs text-muted">
            Manage your delivery destinations for rapid checkout.
          </p>
        </div>
        {!isAddingAddress && (
          <button
            type="button"
            onClick={() => setIsAddingAddress(true)}
            className="border border-black bg-black px-4 py-2.5 text-[10px] font-semibold tracking-[0.14em] uppercase text-white hover:opacity-85"
          >
            + ADD ADDRESS
          </button>
        )}
      </div>

      {message && (
        <div
          role="status"
          aria-live="polite"
          className="mb-6 border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-800"
        >
          {message}
        </div>
      )}

      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-6 border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs text-red-700"
        >
          {error}
        </div>
      )}

      {isAddingAddress && (
        <AddressCreateForm
          recipientName={recipientName}
          setRecipientName={setRecipientName}
          phone={phone}
          setPhone={setPhone}
          street={street}
          setStreet={setStreet}
          apartment={apartment}
          setApartment={setApartment}
          city={city}
          setCity={setCity}
          province={province}
          setProvince={setProvince}
          postalCode={postalCode}
          setPostalCode={setPostalCode}
          isDefault={isDefault}
          setIsDefault={setIsDefault}
          isPending={isPending}
          onSubmit={handleSubmit}
          onCancel={() => setIsAddingAddress(false)}
        />
      )}

      {addresses.length === 0 ? (
        <div className="border border-dashed border-line p-8 text-center">
          <p className="text-sm font-medium text-black">No addresses saved yet</p>
          <p className="mt-1 text-xs text-muted">
            Add your primary shipping destination to enjoy seamless ordering.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`flex flex-col justify-between border p-5 transition-colors ${
                addr.isDefault ? "border-black bg-surface-raised" : "border-line bg-surface"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-black">
                    {addr.recipientName}
                  </span>
                  {addr.isDefault && (
                    <span className="border border-black bg-black px-2 py-0.5 text-[8px] font-bold tracking-widest uppercase text-white">
                      DEFAULT
                    </span>
                  )}
                </div>

                <div className="space-y-1 text-xs text-muted leading-relaxed">
                  <p>{addr.phone}</p>
                  <p className="text-black">{addr.street}</p>
                  {addr.apartment && <p>{addr.apartment}</p>}
                  <p>
                    {addr.city}, {addr.province} {addr.postalCode}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-line/60 pt-3">
                {!addr.isDefault ? (
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => onSetDefault(addr.id)}
                    className="text-[10px] font-semibold uppercase tracking-wider text-muted hover:text-black underline underline-offset-4"
                  >
                    Set as default
                  </button>
                ) : (
                  <span className="text-[10px] text-muted">Primary Address</span>
                )}
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => onDelete(addr.id)}
                  className="text-[10px] uppercase tracking-wider text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
