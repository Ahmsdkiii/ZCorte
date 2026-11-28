"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginAction, registerAction } from "@/actions/auth.actions";

export function useAuthViewModel(mode: "login" | "register") {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const updateField = useCallback((field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    setErrorMessage(null);
  }, []);

  const toggleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const fillDemoAccount = useCallback((role: "owner" | "customer") => {
    if (role === "customer") {
      setForm((prev) => ({
        ...prev,
        email: "customer@zcorte.local",
        password: "CustomerDemoPassword123!",
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        email: "owner@zcorte.local",
        password: "OwnerDemoPassword123!",
      }));
    }
    setFieldErrors({});
    setErrorMessage(null);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setErrorMessage(null);
      setFieldErrors({});

      try {
        if (mode === "login") {
          const res = await loginAction({
            email: form.email,
            password: form.password,
          });

          if (!res.ok) {
            setErrorMessage(res.message);
            if (res.fieldErrors) {
              setFieldErrors(
                Object.fromEntries(
                  Object.entries(res.fieldErrors).map(([key, messages]) => [key, messages[0] ?? ""])
                )
              );
            }
            setIsSubmitting(false);
            return;
          }

          const destination =
            res.data.role === "OWNER" && callbackUrl === "/" ? "/admin" : callbackUrl;
          router.push(destination);
          router.refresh();
        } else {
          const res = await registerAction({
            name: form.name,
            email: form.email,
            phone: form.phone,
            password: form.password,
            confirmPassword: form.confirmPassword,
          });

          if (!res.ok) {
            setErrorMessage(res.message);
            if (res.fieldErrors) {
              setFieldErrors(
                Object.fromEntries(
                  Object.entries(res.fieldErrors).map(([key, messages]) => [key, messages[0] ?? ""])
                )
              );
            }
            setIsSubmitting(false);
            return;
          }

          router.push(callbackUrl);
          router.refresh();
        }
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : "An unexpected error occurred.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [mode, form, callbackUrl, router]
  );

  return {
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
  };
}
