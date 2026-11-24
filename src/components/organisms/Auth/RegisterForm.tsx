"use client";

import React from "react";
import Link from "next/link";
import { useAuthViewModel } from "@/hooks/useAuthViewModel";
import { cn } from "@/lib/utils";

export function RegisterForm() {
  const {
    form,
    showPassword,
    isSubmitting,
    errorMessage,
    fieldErrors,
    callbackUrl,
    updateField,
    toggleShowPassword,
    handleSubmit,
  } = useAuthViewModel("register");

  const inputBase =
    "w-full border border-line bg-surface-raised px-4 py-3.5 text-xs text-ink placeholder:text-muted/70 transition-colors focus:border-ink focus:outline-none";

  return (
    <div className="w-full">
      <div className="mb-8 border-b border-line pb-6">
        <span className="eyebrow block text-muted">ZCORTÉ / MEMBERSHIP</span>
        <h1 className="mt-3 text-[clamp(30px,3.4vw,40px)] font-bold tracking-[-0.035em] text-ink uppercase">
          CREATE ACCOUNT
        </h1>
        <p className="mt-2 text-xs text-muted">
          Register to order technical pieces, track dispatch, and save preferences.
        </p>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="mb-6 border-l-2 border-red-600 bg-red-500/10 px-4 py-3 text-xs font-medium text-red-700"
        >
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="reg-name" className="eyebrow mb-2 block text-[8px] text-muted uppercase">
            FULL NAME *
          </label>
          <input
            id="reg-name"
            type="text"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Your full name"
            className={cn(inputBase, fieldErrors.name && "border-red-600")}
          />
          {fieldErrors.name && (
            <p className="mt-1.5 text-[11px] text-red-600" role="alert">
              {fieldErrors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="reg-email" className="eyebrow mb-2 block text-[8px] text-muted uppercase">
            EMAIL ADDRESS *
          </label>
          <input
            id="reg-email"
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="client@domain.com"
            className={cn(inputBase, fieldErrors.email && "border-red-600")}
          />
          {fieldErrors.email && (
            <p className="mt-1.5 text-[11px] text-red-600" role="alert">
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="reg-phone" className="eyebrow mb-2 block text-[8px] text-muted uppercase">
            PHONE NUMBER *
          </label>
          <input
            id="reg-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            placeholder="+62 812 3456 7890"
            className={cn(inputBase, fieldErrors.phone && "border-red-600")}
          />
          {fieldErrors.phone && (
            <p className="mt-1.5 text-[11px] text-red-600" role="alert">
              {fieldErrors.phone}
            </p>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="reg-password" className="eyebrow text-[8px] text-muted uppercase">
              PASSWORD (MIN. 10 CHARACTERS) *
            </label>
            <button
              type="button"
              onClick={toggleShowPassword}
              className="text-[9px] tracking-[0.06em] text-muted hover:text-ink cursor-pointer"
            >
              {showPassword ? "HIDE" : "SHOW"}
            </button>
          </div>
          <input
            id="reg-password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(e) => updateField("password", e.target.value)}
            placeholder="At least 10 characters"
            className={cn(inputBase, fieldErrors.password && "border-red-600")}
          />
          {fieldErrors.password && (
            <p className="mt-1.5 text-[11px] text-red-600" role="alert">
              {fieldErrors.password}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="reg-confirmPassword"
            className="eyebrow mb-2 block text-[8px] text-muted uppercase"
          >
            CONFIRM PASSWORD *
          </label>
          <input
            id="reg-confirmPassword"
            type={showPassword ? "text" : "password"}
            value={form.confirmPassword}
            onChange={(e) => updateField("confirmPassword", e.target.value)}
            placeholder="Re-enter password"
            className={cn(inputBase, fieldErrors.confirmPassword && "border-red-600")}
          />
          {fieldErrors.confirmPassword && (
            <p className="mt-1.5 text-[11px] text-red-600" role="alert">
              {fieldErrors.confirmPassword}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 flex min-h-[52px] w-full cursor-pointer items-center justify-center bg-button px-6 py-4 text-[11px] font-semibold tracking-[0.08em] text-button-text uppercase transition-colors hover:bg-button-hover disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "REGISTERING ACCOUNT..." : "CREATE ACCOUNT"}
        </button>
      </form>

      <div className="mt-8 border-t border-line pt-6 text-center text-xs text-muted">
        <span>Already have an account? </span>
        <Link
          href={`/login${callbackUrl !== "/" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
          className="font-medium text-ink underline underline-offset-4 hover:text-muted transition-colors"
        >
          SIGN IN
        </Link>
      </div>
    </div>
  );
}
