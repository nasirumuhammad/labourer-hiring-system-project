"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
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
import { applyFieldError } from "@/lib/apply-field-error";
import { ApiError } from "@/lib/api/api-error";
import { toast } from "sonner";
import { useFormSubmission } from "@/hooks/useform-submission";

const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SigninValues = z.infer<typeof signinSchema>;

export function SigninForm() {
  const router = useRouter();
  useEffect(() => {
    router.prefetch("/dashboard");
  }, [router]);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SigninValues>({
    resolver: zodResolver(signinSchema),
    defaultValues: { email: "", password: "" },
  });

  const { isBusy, markRedirecting } = useFormSubmission();

  const onSubmit = async (data: SigninValues) => {
    try {
      const response = await authApi.signin(data);
      markRedirecting();
      toast.success(response?.message);
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof ApiError) {
        const handleError = applyFieldError(error, setError);
        if (!handleError) toast.error(error.message);
      }
    }
  };
  const busy = isBusy(isSubmitting);
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Field data-invalid={!!errors.email}>
                <FieldLabel>Email</FieldLabel>
                <Input placeholder="you@example.com" {...field} />
                {errors.email && (
                  <FieldError>{errors.email.message}</FieldError>
                )}
              </Field>
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Field data-invalid={!!errors.password}>
                <FieldLabel>Password</FieldLabel>
                <Input type="password" placeholder="••••••••" {...field} />
                {errors.password && (
                  <FieldError>{errors.password.message}</FieldError>
                )}
              </Field>
            )}
          />

          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Loading..." : "Sign In"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <div className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
        <Link
          href="/forgot-password"
          className="text-sm text-muted-foreground hover:underline"
        >
          Forgot password?
        </Link>
      </CardFooter>
    </Card>
  );
}
