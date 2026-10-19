"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ErrorNote } from "@/components/layout/page";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { applyFieldError } from "@/lib/apply-field-error";
import { ApiError } from "@/lib/api/api-error";
import { jobsApi } from "@/lib/job";
import type { CreateJobDto, Job, PaymentType } from "@/types/job";
import { cn } from "cn";
import { toast } from "sonner";

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

export function PostJobForm({
  job,
  priceLocked = false,
}: {
  job?: Job;
  /** True once someone has applied: the pay fields can no longer change. */
  priceLocked?: boolean;
}) {
  const router = useRouter();
  const isEdit = !!job;
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<PostJobValues>({
    resolver: zodResolver(postJobSchema),
    defaultValues: {
      title: job?.title ?? "",
      companyName: job?.companyName ?? "",
      description: job?.description ?? "",
      location: job?.location ?? "",
      paymentType: job?.paymentType ?? "fixed",
      minPay: job ? String(Number(job.minPay)) : "",
      maxPay: job ? String(Number(job.maxPay)) : "",
      minExperienceYears: job?.minExperienceYears ? String(job.minExperienceYears) : "",
      skills: job?.skills.join(", ") ?? "",
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

      if (job) {
        // Never send pay fields once the job has applicants; the API rejects them.
        const { minPay, maxPay, paymentType, ...rest } = payload;
        void minPay;
        void maxPay;
        void paymentType;
        await jobsApi.update(job.id, priceLocked ? rest : payload);
        toast.success("Job updated");
      } else {
        await jobsApi.create(payload);
      }
      router.push("/employer/jobs");
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError) {
        const handledFieldError = applyFieldError(error, setError);
        if (!handledFieldError) setSubmitError(error.message);
      }
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
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
            <Textarea rows={5} placeholder="What will this person be doing day to day?" {...field} />
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
            <div className="grid gap-2 sm:grid-cols-2">
              {PAYMENT_TYPE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  disabled={priceLocked}
                  onClick={() => field.onChange(option.value)}
                  aria-pressed={field.value === option.value}
                  className={cn(
                    "rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60",
                    field.value === option.value
                      ? "border-primary bg-brand-soft text-brand"
                      : "border-input bg-card hover:bg-brand-soft/50",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </Field>
        )}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Controller
          name="minPay"
          control={control}
          render={({ field }) => (
            <Field data-invalid={!!errors.minPay}>
              <FieldLabel>Minimum pay</FieldLabel>
              <Input inputMode="decimal" placeholder="e.g. 5000" disabled={priceLocked} {...field} />
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
              <Input inputMode="decimal" placeholder="e.g. 8000" disabled={priceLocked} {...field} />
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

      {submitError && <ErrorNote message={submitError} />}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {isEdit && (
          <Button type="button" variant="outline" onClick={() => router.push("/employer/jobs")}>
            Cancel
          </Button>
        )}
        <Button type="submit" size="lg" disabled={isLoading}>
          {isLoading
            ? isEdit
              ? "Saving..."
              : "Posting..."
            : isEdit
              ? "Save changes"
              : "Post job"}
        </Button>
      </div>
    </form>
  );
}
