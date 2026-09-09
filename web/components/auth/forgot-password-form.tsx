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

const forgotSchema = z.object({
  email: z.string().email("Invalid email"),
});

type ForgotValues = z.infer<typeof forgotSchema>;

export function ForgotPasswordForm() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (data: ForgotValues) => {
    router.push(`/forgot-password/otp?email=${encodeURIComponent(data.email)}`);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Reset password</CardTitle>
        <CardDescription>
          Enter your email and we'll send you a verification code.
        </CardDescription>
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

          <Button type="submit" className="w-full">
            Send OTP
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
