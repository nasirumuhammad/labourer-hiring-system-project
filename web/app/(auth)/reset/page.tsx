import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Suspense } from "react";

export default function ResetPage() {
  return;
  <Suspense
    fallback={
      <div className="text-center py-8">Loading verification page...</div>
    }
  >
    <ResetPasswordForm />
  </Suspense>;
}
