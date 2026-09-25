"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { applyFieldError } from "@/lib/apply-field-error";
import { ApiError } from "@/lib/api/api-error";
import { jobsApi } from "@/lib/job";
import { RichTextEditor } from "../ui/rich-text-editor";

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "").trim();

const applySchema = z.object({
  proposal: z
    .string()
    .trim()
    .refine((html) => stripHtml(html).length >= 20, {
      message: "Proposal must be at least 20 characters",
    }),
});

type ApplyValues = z.infer<typeof applySchema>;

export function ApplyJobForm({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ApplyValues>({
    resolver: zodResolver(applySchema),
    defaultValues: {
      proposal: "",
    },
  });

  const onSubmit = async (data: ApplyValues) => {
    try {
      setIsLoading(true);
      setSubmitError(null);

      await jobsApi.apply(jobId, data);

      router.push("/applications?applied=success");
    } catch (error) {
      if (error instanceof ApiError) {
        const handledFieldError = applyFieldError(error, setError);

        if (!handledFieldError) {
          setSubmitError(error.message);
        }
      }

      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Field data-invalid={!!errors.proposal}>
        <FieldLabel htmlFor="proposal">Your proposal</FieldLabel>
        <Controller
          name="proposal"
          control={control}
          render={({ field }) => (
            <RichTextEditor
              value={field.value}
              onChange={field.onChange}
              disabled={isLoading}
              placeholder="Write your proposal..."
            />
          )}
        />

        {errors.proposal && <FieldError>{errors.proposal.message}</FieldError>}
      </Field>

      {submitError && <p className="text-sm text-destructive">{submitError}</p>}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Submitting..." : "Submit Application"}
      </Button>
    </form>
  );
}
