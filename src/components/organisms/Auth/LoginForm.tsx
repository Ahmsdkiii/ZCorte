"use client";

import React from "react";
import Link from "next/link";
import { useAuthViewModel } from "@/hooks/useAuthViewModel";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const {
    form,
    showPassword,
    isSubmitting,
    errorMessage,
    fieldErrors,
    callbackUrl,
    updateField,
    toggleShowPassword,
    fillDemoAccount,
    handleSubmit,
  } = useAuthViewModel("login");

  const inputBase =
    "w-full border border-line bg-surface-raised px-4 py-3.5 text-xs text-ink placeholder:text-muted/70 transition-colors focus:border-ink focus:outline-none";

  return (
    <div className="w-full">
      <div className="mb-8 border-b border-line pb-6">
        <span className="eyebrow block text-muted">ZCORTÉ / CLIENT ACCESS</span>
        <h1 className="mt-3 text-[clamp(30px,3.4vw,40px)] font-bold tracking-[-0.035em] text-ink uppercase">
          SIGN IN
        </h1>
        <p className="mt-2 text-xs text-muted">
          Access your ZCorté bag, order dispatch history, and client profile.
        </p>
      </div>

      {/* Demo Credentials Quick Fill Buttons */}
      <div className="mb-6 border border-dashed border-line/80 bg-surface p-4">
        <span className="eyebrow block text-[8px] text-muted uppercase">
          DEMO ACCOUNTS (1-CLICK)
        </span>
        <div className="mt-2.5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => fillDemoAccount("customer")}
            className="border border-line bg-surface-raised px-3 py-1.5 text-[9px] font-semibold tracking-[0.08em] text-ink uppercase hover:border-ink transition-colors cursor-pointer"
          >
            CUSTOMER DEMO
          </button>
          <button
            type="button"
            onClick={() => fillDemoAccount("owner")}
            className="border border-line bg-surface-raised px-3 py-1.5 text-[9px] font-semibold tracking-[0.08em] text-ink uppercase hover:border-ink transition-colors cursor-pointer"
          >
            OWNER DEMO
          </button>
        </div>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="mb-6 border-l-2 border-red-600 bg-red-500/10 px-4 py-3 text-xs font-medium text-red-700"
        >
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label
            htmlFor="login-email"
            className="eyebrow mb-2 block text-[8px] text-muted uppercase"
          >
            EMAIL ADDRESS *
          </label>
          <input
            id="login-email"
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
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="login-password" className="eyebrow text-[8px] text-muted uppercase">
              PASSWORD *
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
            id="login-password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(e) => updateField("password", e.target.value)}
            placeholder="••••••••••••"
            className={cn(inputBase, fieldErrors.password && "border-red-600")}
          />
          {fieldErrors.password && (
            <p className="mt-1.5 text-[11px] text-red-600" role="alert">
              {fieldErrors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 flex min-h-[52px] w-full cursor-pointer items-center justify-center bg-button px-6 py-4 text-[11px] font-semibold tracking-[0.08em] text-button-text uppercase transition-colors hover:bg-button-hover disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "AUTHENTICATING..." : "SIGN IN TO ACCOUNT"}
        </button>
      </form>

      <div className="mt-8 border-t border-line pt-6 text-center text-xs text-muted">
        <span>Don&apos;t have an account yet? </span>
        <Link
          href={`/register${callbackUrl !== "/" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
          className="font-medium text-ink underline underline-offset-4 hover:text-muted transition-colors"
        >
          CREATE ACCOUNT
        </Link>
      </div>
    </div>
  );
}
