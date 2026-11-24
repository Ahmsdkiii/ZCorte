"use client";

import { useState } from "react";
import type { FC, FormEvent } from "react";
import type { AccountProfileDTO } from "@/models/types/account";

interface AccountProfileSectionProps {
  profile: AccountProfileDTO;
  isPending: boolean;
  message: string | null;
  error: string | null;
  onUpdate: (data: { name: string; phone?: string; personalizationOptIn?: boolean }) => void;
}

export const AccountProfileSection: FC<AccountProfileSectionProps> = ({
  profile,
  isPending,
  message,
  error,
  onUpdate,
}) => {
  const [name, setName] = useState(profile.name || "");
  const [phone, setPhone] = useState(profile.phone || "");
  const [optIn, setOptIn] = useState(profile.personalizationOptIn);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onUpdate({
      name,
      phone,
      personalizationOptIn: optIn,
    });
  };

  return (
    <section aria-labelledby="profile-heading" className="max-w-xl">
      <div className="mb-6">
        <h2 id="profile-heading" className="text-xl font-medium tracking-tight">
          Personal Information
        </h2>
        <p className="mt-1 text-xs text-muted">
          Update your personal details and communication preferences.
        </p>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="account-email"
            className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-muted"
          >
            Email Address (Read-only)
          </label>
          <input
            id="account-email"
            type="email"
            disabled
            value={profile.email}
            className="mt-2 w-full border border-control bg-surface-raised px-3.5 py-2.5 text-xs text-muted cursor-not-allowed opacity-80"
          />
        </div>

        <div>
          <label
            htmlFor="account-name"
            className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-muted"
          >
            Full Name
          </label>
          <input
            id="account-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full border border-control bg-surface px-3.5 py-2.5 text-xs text-black focus:border-black focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="account-phone"
            className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-muted"
          >
            Phone Number (e.g. +62 / 08...)
          </label>
          <input
            id="account-phone"
            type="tel"
            placeholder="081234567890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-2 w-full border border-control bg-surface px-3.5 py-2.5 text-xs text-black focus:border-black focus:outline-none"
          />
        </div>

        <div className="flex items-start gap-3 border-t border-line pt-5">
          <input
            id="personalization-opt-in"
            type="checkbox"
            checked={optIn}
            onChange={(e) => setOptIn(e.target.checked)}
            className="mt-0.5 h-4 w-4 border-control accent-black"
          />
          <label htmlFor="personalization-opt-in" className="text-xs text-muted">
            <span className="font-medium text-black">Opt-in to Personalized Experience</span>
            <p className="mt-0.5 text-[11px]">
              Allow ZCorté AI styling recommendations based on your browsing and purchase history.
            </p>
          </label>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="border border-black bg-black px-6 py-3 text-[10px] font-semibold tracking-[0.14em] uppercase text-white transition-opacity hover:opacity-85 disabled:opacity-50"
        >
          {isPending ? "SAVING..." : "SAVE CHANGES"}
        </button>
      </form>
    </section>
  );
};
