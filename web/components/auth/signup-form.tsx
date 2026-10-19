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
import { useEffect } from "react";
import { applyFieldError } from "@/lib/apply-field-error";
import { ApiError } from "@/lib/api/api-error";
import { toast } from "sonner";
import { useFormSubmission } from "@/hooks/useform-submission";
import { cn } from "cn";

const signupSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["client", "employer"]),
});

export type SignupValues = z.infer<typeof signupSchema>;

const ROLE_OPTIONS: {
  value: SignupValues["role"];
  label: string;
  description: string;
}[] = [
  {
    value: "client",
    label: "I'm a client",
    description: "Browse jobs and apply for work",
  },
  {
    value: "employer",
    label: "I'm hiring",
    description: "Post jobs and review applicants",
  },
];

export function SignupForm() {
  const router = useRouter();
  useEffect(() => {
    router.prefetch("/dashboard");
  }, [router]);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", role: "client" },
  });

  const { isBusy, markRedirecting } = useFormSubmission();
  const onSubmit = async (data: SignupValues) => {
    try {
      const response = await authApi.signup(data);
      markRedirecting();
      toast.success(response?.message ?? "Account created successfully");
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof ApiError) {
        const handledFieldError = applyFieldError(error, setError);
        if (!handledFieldError) toast.error(error.message);
      }
    }
  };
  const busy = isBusy(isSubmitting);
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>Choose how you will use JobLink to get started.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel>I want to...</FieldLabel>
                <div className="grid gap-2 sm:grid-cols-2">
                  {ROLE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => field.onChange(option.value)}
                      aria-pressed={field.value === option.value}
                      className={cn(
                        "flex flex-col items-start gap-0.5 rounded-xl border px-3 py-3 text-left transition-colors",
                        field.value === option.value
                          ? "border-primary bg-brand-soft"
                          : "border-input bg-card hover:bg-brand-soft/50",
                      )}
                    >
                      <span className="text-sm font-medium">
                        {option.label}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {option.description}
                      </span>
                    </button>
                  ))}
                </div>
              </Field>
            )}
          />

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
            {busy ? "Loading..." : "Sign Up"}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <div className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/signin" className="font-medium text-link hover:underline">
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
