"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError } from "@/components/ui/field";
import { authApi } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/api-error";
import { toast } from "sonner";

export function OtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) {
      router.push("/forgot-password");
    }
  }, [email, router]);

  const handleChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    setError("");
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }
    try {
      setLoading(true);
      const response = await authApi.verifyOtp({ email, otp: code });
      const resetToken = response?.data?.resetToken;
      router.push(
        `/reset?email=${encodeURIComponent(email)}&token=${encodeURIComponent(resetToken ?? "")}`,
      );
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Invalid or expired code",
      );
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      await authApi.resendOtp({ email });
      toast.success("A new code has been sent");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to resend code");
    } finally {
      setResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Verify your email</CardTitle>
        <CardDescription>
          Enter the 6‑digit code sent to <strong>{email}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Field data-invalid={!!error}>
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl font-semibold border rounded-lg focus:ring-2 focus:ring-primary outline-none bg-background"
                aria-invalid={!!error}
              />
            ))}
          </div>
          {error && <FieldError>{error}</FieldError>}
        </Field>

        <Button onClick={handleSubmit} className="w-full" disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </Button>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link
          href="/forgot-password"
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Try again
        </Link>
        <button
          type="button"
          onClick={handleResend}
          disabled={resending}
          className="text-sm text-primary hover:underline disabled:opacity-50"
        >
          {resending ? "Sending..." : "Resend code"}
        </button>
      </CardFooter>
    </Card>
  );
}
