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
import type { CreateJobDto, PaymentType } from "@/types/job";
import { cn } from "cn";

const NUMERIC_PATTERN = /^\d+(\.\d{1,2})?$/;

const postJobSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    companyName: z
      .string()
      .min(3, "Company name must be at least 3 characters"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    location: z.string().optional(),
    paymentType: z.enum(["fixed", "hourly"]),
    minPay: z
      .string()
      .min(1, "Minimum pay is required")
      .regex(NUMERIC_PATTERN, "Enter a valid amount"),
    maxPay: z
      .string()
      .min(1, "Maximum pay is required")
      .regex(NUMERIC_PATTERN, "Enter a valid amount"),
    minExperienceYears: z
      .string()
      .optional()
      .refine(
        (value) => !value || /^\d+$/.test(value),
        "Enter a whole number of years",
      ),
    skills: z.string().optional(),
  })
  .refine((data) => Number(data.maxPay) >= Number(data.minPay), {
    message: "Maximum pay must be at least the minimum pay",
    path: ["maxPay"],
  });

type PostJobValues = z.infer<typeof postJobSchema>;

const PAYMENT_TYPE_OPTIONS: { value: PaymentType; label: string }[] = [
  { value: "fixed", label: "Fixed price" },
  { value: "hourly", label: "Hourly rate" },
];

export function PostJobForm() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<PostJobValues>({
    resolver: zodResolver(postJobSchema),
    defaultValues: {
      title: "",
      companyName: "",
      description: "",
      location: "",
      paymentType: "fixed",
      minPay: "",
      maxPay: "",
      minExperienceYears: "",
      skills: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (data: PostJobValues) => {
    try {
      setIsLoading(true);
      setSubmitError(null);

      const payload: CreateJobDto = {
        title: data.title,
        companyName: data.companyName,
        description: data.description,
        location: data.location || undefined,
        paymentType: data.paymentType,
        minPay: data.minPay,
        maxPay: data.maxPay,
        minExperienceYears: data.minExperienceYears
          ? Number(data.minExperienceYears)
          : undefined,
        skills: data.skills
          ? data.skills
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean)
          : undefined,
      };

      await jobsApi.create(payload);
      router.push("/employer/jobs");
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
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <Field data-invalid={!!errors.title}>
            <FieldLabel>Job title</FieldLabel>
            <Input placeholder="e.g. Warehouse Loader" {...field} />
            {errors.title && <FieldError>{errors.title.message}</FieldError>}
          </Field>
        )}
      />

      <Controller
        name="companyName"
        control={control}
        render={({ field }) => (
          <Field data-invalid={!!errors.companyName}>
            <FieldLabel>Company name</FieldLabel>
            <Input placeholder="e.g. Acme Logistics" {...field} />
            {errors.companyName && (
              <FieldError>{errors.companyName.message}</FieldError>
            )}
          </Field>
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <Field data-invalid={!!errors.description}>
            <FieldLabel>Description</FieldLabel>
            <textarea
              rows={5}
              placeholder="What will this person be doing day to day?"
              className={cn(
                "w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30",
              )}
              {...field}
            />
            {errors.description && (
              <FieldError>{errors.description.message}</FieldError>
            )}
          </Field>
        )}
      />

      <Controller
        name="location"
        control={control}
        render={({ field }) => (
          <Field data-invalid={!!errors.location}>
            <FieldLabel>Location (optional)</FieldLabel>
            <Input placeholder="e.g. Abuja, FCT" {...field} />
            {errors.location && (
              <FieldError>{errors.location.message}</FieldError>
            )}
          </Field>
        )}
      />

      <Controller
        name="paymentType"
        control={control}
        render={({ field }) => (
          <Field>
            <FieldLabel>Payment type</FieldLabel>
            <div className="grid grid-cols-2 gap-2">
              {PAYMENT_TYPE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => field.onChange(option.value)}
                  aria-pressed={field.value === option.value}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                    field.value === option.value
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-input hover:bg-muted/50",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </Field>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="minPay"
          control={control}
          render={({ field }) => (
            <Field data-invalid={!!errors.minPay}>
              <FieldLabel>Minimum pay</FieldLabel>
              <Input inputMode="decimal" placeholder="e.g. 5000" {...field} />
              {errors.minPay && (
                <FieldError>{errors.minPay.message}</FieldError>
              )}
            </Field>
          )}
        />

        <Controller
          name="maxPay"
          control={control}
          render={({ field }) => (
            <Field data-invalid={!!errors.maxPay}>
              <FieldLabel>Maximum pay</FieldLabel>
              <Input inputMode="decimal" placeholder="e.g. 8000" {...field} />
              {errors.maxPay && (
                <FieldError>{errors.maxPay.message}</FieldError>
              )}
            </Field>
          )}
        />
      </div>

      <Controller
        name="minExperienceYears"
        control={control}
        render={({ field }) => (
          <Field data-invalid={!!errors.minExperienceYears}>
            <FieldLabel>Minimum experience in years (optional)</FieldLabel>
            <Input inputMode="numeric" placeholder="e.g. 2" {...field} />
            {errors.minExperienceYears && (
              <FieldError>{errors.minExperienceYears.message}</FieldError>
            )}
          </Field>
        )}
      />

      <Controller
        name="skills"
        control={control}
        render={({ field }) => (
          <Field data-invalid={!!errors.skills}>
            <FieldLabel>Skills (optional, comma separated)</FieldLabel>
            <Input placeholder="e.g. forklift, heavy lifting" {...field} />
            {errors.skills && <FieldError>{errors.skills.message}</FieldError>}
          </Field>
        )}
      />

      {submitError && <p className="text-sm text-destructive">{submitError}</p>}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Posting..." : "Post Job"}
      </Button>
    </form>
  );
}
