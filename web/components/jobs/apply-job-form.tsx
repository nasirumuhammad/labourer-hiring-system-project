"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { applyFieldError } from "@/lib/apply-field-error";
import { ApiError } from "@/lib/api/api-error";
import { jobsApi } from "@/lib/job";

const applySchema = z.object({
  bankName: z.string().min(2, "Bank name is required"),
  bankAccountNumber: z.string().length(10, "Account number must be 10 digits"),
  bvn: z.string().length(11, "BVN must be 11 digits"),
});

type ApplyValues = z.infer<typeof applySchema>;

export function ApplyJobForm({ jobId }: { jobId: string }) {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ApplyValues>({
    resolver: zodResolver(applySchema),
    defaultValues: { bankName: "", bankAccountNumber: "", bvn: "" },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (data: ApplyValues) => {
    try {
      setIsLoading(true);
      setSubmitError(null);
      await jobsApi.apply(jobId, data);
      router.push("/applications?applied=success");
    } catch (error) {
      if (error instanceof ApiError) {
        const handledFieldError = applyFieldError(error, setError);
        if (!handledFieldError) setSubmitError(error.message);
      }
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        We need your payout details to process payment if you&apos;re hired.
      </p>

      <Controller
        name="bankName"
        control={control}
        render={({ field }) => (
          <Field data-invalid={!!errors.bankName}>
            <FieldLabel>Bank name</FieldLabel>
            <Input placeholder="e.g. GTBank" {...field} />
            {errors.bankName && (
              <FieldError>{errors.bankName.message}</FieldError>
            )}
          </Field>
        )}
      />

      <Controller
        name="bankAccountNumber"
        control={control}
        render={({ field }) => (
          <Field data-invalid={!!errors.bankAccountNumber}>
            <FieldLabel>Account number</FieldLabel>
            <Input placeholder="10-digit account number" {...field} />
            {errors.bankAccountNumber && (
              <FieldError>{errors.bankAccountNumber.message}</FieldError>
            )}
          </Field>
        )}
      />

      <Controller
        name="bvn"
        control={control}
        render={({ field }) => (
          <Field data-invalid={!!errors.bvn}>
            <FieldLabel>BVN</FieldLabel>
            <Input placeholder="11-digit BVN" {...field} />
            {errors.bvn && <FieldError>{errors.bvn.message}</FieldError>}
          </Field>
        )}
      />

      {submitError && <p className="text-sm text-destructive">{submitError}</p>}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Submitting..." : "Submit Application"}
      </Button>
    </form>
  );
}
