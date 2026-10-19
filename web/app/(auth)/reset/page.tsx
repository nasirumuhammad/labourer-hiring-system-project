import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Set a new password",
  description: "Choose a new password for your JobLink account.",
  robots: { index: false },
};

export default function ResetPage() {
  return (
    <Suspense
      fallback={
        <p className="py-8 text-center text-sm text-neutral-500">Loading...</p>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
