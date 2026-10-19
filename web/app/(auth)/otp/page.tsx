import type { Metadata } from "next";
import { Suspense } from "react";
import { OtpForm } from "@/components/auth/otp-form";

export const metadata: Metadata = {
  title: "Verify your email",
  description:
    "Enter the 6-digit code we emailed you to continue resetting your password.",
  robots: { index: false },
};

export default function OtpPage() {
  return (
    <Suspense
      fallback={
        <p className="py-8 text-center text-sm text-neutral-500">
          Loading verification...
        </p>
      }
    >
      <OtpForm />
    </Suspense>
  );
}
