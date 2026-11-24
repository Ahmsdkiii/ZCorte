"use client";

import type { FC, FormEvent } from "react";

interface AddressFormProps {
  recipientName: string;
  setRecipientName: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  street: string;
  setStreet: (val: string) => void;
  apartment: string;
  setApartment: (val: string) => void;
  city: string;
  setCity: (val: string) => void;
  province: string;
  setProvince: (val: string) => void;
  postalCode: string;
  setPostalCode: (val: string) => void;
  isDefault: boolean;
  setIsDefault: (val: boolean) => void;
  isPending: boolean;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
}

export const AddressCreateForm: FC<AddressFormProps> = ({
  recipientName,
  setRecipientName,
  phone,
  setPhone,
  street,
  setStreet,
  apartment,
  setApartment,
  city,
  setCity,
  province,
  setProvince,
  postalCode,
  setPostalCode,
  isDefault,
  setIsDefault,
  isPending,
  onSubmit,
  onCancel,
}) => {
  return (
    <div className="mb-8 border border-line bg-surface-raised p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-wide uppercase">New Delivery Address</h3>
        <button type="button" onClick={onCancel} className="text-xs text-muted hover:text-black">
          Cancel
        </button>
      </div>

      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="addr-recipient"
            className="block text-[10px] font-semibold uppercase text-muted"
          >
            Recipient Name
          </label>
          <input
            id="addr-recipient"
            required
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            className="mt-1.5 w-full border border-control bg-surface px-3 py-2 text-xs focus:border-black focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="addr-phone"
            className="block text-[10px] font-semibold uppercase text-muted"
          >
            Phone Number
          </label>
          <input
            id="addr-phone"
            required
            placeholder="081234567890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1.5 w-full border border-control bg-surface px-3 py-2 text-xs focus:border-black focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="addr-street"
            className="block text-[10px] font-semibold uppercase text-muted"
          >
            Street Address
          </label>
          <input
            id="addr-street"
            required
            placeholder="Jl. Sukajadi No. 123"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className="mt-1.5 w-full border border-control bg-surface px-3 py-2 text-xs focus:border-black focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="addr-apartment"
            className="block text-[10px] font-semibold uppercase text-muted"
          >
            Apartment / Unit (Optional)
          </label>
          <input
            id="addr-apartment"
            placeholder="Tower B Lt. 8"
            value={apartment}
            onChange={(e) => setApartment(e.target.value)}
            className="mt-1.5 w-full border border-control bg-surface px-3 py-2 text-xs focus:border-black focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="addr-city"
            className="block text-[10px] font-semibold uppercase text-muted"
          >
            City / Regency
          </label>
          <input
            id="addr-city"
            required
            placeholder="Kota Bandung"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="mt-1.5 w-full border border-control bg-surface px-3 py-2 text-xs focus:border-black focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="addr-province"
            className="block text-[10px] font-semibold uppercase text-muted"
          >
            Province
          </label>
          <input
            id="addr-province"
            required
            placeholder="Jawa Barat"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="mt-1.5 w-full border border-control bg-surface px-3 py-2 text-xs focus:border-black focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="addr-postal"
            className="block text-[10px] font-semibold uppercase text-muted"
          >
            Postal Code (5 Digits)
          </label>
          <input
            id="addr-postal"
            required
            maxLength={5}
            placeholder="40162"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="mt-1.5 w-full border border-control bg-surface px-3 py-2 text-xs focus:border-black focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 sm:col-span-2 pt-2">
          <input
            id="addr-default"
            type="checkbox"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
            className="h-4 w-4 border-control accent-black"
          />
          <label htmlFor="addr-default" className="text-xs text-muted">
            Set as default delivery address
          </label>
        </div>

        <div className="sm:col-span-2 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="border border-black bg-black px-6 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white hover:opacity-85 disabled:opacity-50"
          >
            {isPending ? "SAVING..." : "SAVE ADDRESS"}
          </button>
        </div>
      </form>
    </div>
  );
};
