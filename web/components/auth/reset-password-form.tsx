"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { authApi } from "@/lib/api/auth";
import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api/api-error";
import { toast } from "sonner";

const resetSchema = z
  .object({
    newPassword: z.string().min(8, "Minimum 8 characters"),
    confirmPassword: z.string().min(8, "Minimum 8 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetValues = z.infer<typeof resetSchema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  useEffect(() => {
    if (!email || !token) {
      router.push("/forgot-password");
    }
  }, [email, token, router]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: ResetValues) => {
    try {
      setIsLoading(true);
      await authApi.resetPassword({ token, password: data.newPassword });
      router.push("/signin?reset=success");
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Something went wrong. Please try again.",
      );
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Set new password</CardTitle>
        <CardDescription>Create a new password for {email}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="newPassword"
            control={control}
            render={({ field }) => (
              <Field data-invalid={!!errors.newPassword}>
                <FieldLabel>New password</FieldLabel>
                <Input type="password" placeholder="••••••••" {...field} />
                {errors.newPassword && (
                  <FieldError>{errors.newPassword.message}</FieldError>
                )}
              </Field>
            )}
          />

          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <Field data-invalid={!!errors.confirmPassword}>
                <FieldLabel>Confirm password</FieldLabel>
                <Input type="password" placeholder="••••••••" {...field} />
                {errors.confirmPassword && (
                  <FieldError>{errors.confirmPassword.message}</FieldError>
                )}
              </Field>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <Link
          href="/signin"
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Back to sign in
        </Link>
      </CardFooter>
    </Card>
  );
}
