import { OtpForm } from "@/components/auth/otp-form";
import { Suspense } from "react";

export default function OtpPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-8">Loading verification page...</div>
      }
    >
      <OtpForm />
    </Suspense>
  );
}
