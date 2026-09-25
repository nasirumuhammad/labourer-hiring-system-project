"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { profileApi } from "@/lib/profile";
import { ApiError } from "@/lib/api/api-error";
import { applyFieldError } from "@/lib/apply-field-error";
import { toast } from "sonner";

const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phoneNumber: z.string().min(7, "Enter a valid phone number"),
  state: z.string().min(2, "State is required"),
  lga: z.string().min(2, "LGA is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  identityType: z.enum(["bvn", "nin"]),
  identityNumber: z.string().min(1, "Identity number is required"),
  bankName: z.string().min(2, "Bank name is required"),
  bankAccountNumber: z.string().min(10, "Bank account number must be valid"),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      state: "",
      lga: "",
      address: "",
      identityType: "bvn",
      identityNumber: "",
      bankName: "",
      bankAccountNumber: "",
    },
  });

  const identityType = form.watch("identityType");

  const onSubmit = async (values: ProfileFormValues) => {
    setIsSubmitting(true);

    try {
      await profileApi.create({
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
        state: values.state,
        lga: values.lga,
        address: values.address,
        bankName: values.bankName,
        bankAccountNumber: values.bankAccountNumber,
        identityType: values.identityType,
        identityNumber: values.identityNumber,
      });

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError) {
        const handleError = applyFieldError(error, form.setError);
        if (!handleError) toast.error(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete your profile</CardTitle>
        <CardDescription>
          Enter your personal and payment information to continue.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="firstName">First name</FieldLabel>
              <Input
                id="firstName"
                {...form.register("firstName")}
                disabled={isSubmitting}
              />
              <FieldError>
                {form.formState.errors.firstName?.message}
              </FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="lastName">Last name</FieldLabel>
              <Input
                id="lastName"
                {...form.register("lastName")}
                disabled={isSubmitting}
              />
              <FieldError>{form.formState.errors.lastName?.message}</FieldError>
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="phoneNumber">Phone number</FieldLabel>
            <Input
              id="phoneNumber"
              type="tel"
              {...form.register("phoneNumber")}
              disabled={isSubmitting}
            />
            <FieldError>
              {form.formState.errors.phoneNumber?.message}
            </FieldError>
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="state">State</FieldLabel>
              <Input
                id="state"
                {...form.register("state")}
                disabled={isSubmitting}
              />
              <FieldError>{form.formState.errors.state?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="lga">LGA</FieldLabel>
              <Input
                id="lga"
                {...form.register("lga")}
                disabled={isSubmitting}
              />
              <FieldError>{form.formState.errors.lga?.message}</FieldError>
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="address">Address</FieldLabel>
            <Textarea
              id="address"
              {...form.register("address")}
              disabled={isSubmitting}
            />
            <FieldError>{form.formState.errors.address?.message}</FieldError>
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="identityType">Identity document</FieldLabel>

              <select
                id="identityType"
                {...form.register("identityType")}
                disabled={isSubmitting}
                className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
              >
                <option value="bvn">BVN</option>
                <option value="nin">NIN</option>
              </select>

              <FieldError>
                {form.formState.errors.identityType?.message}
              </FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="identityNumber">
                {identityType === "bvn" ? "BVN" : "NIN"}
              </FieldLabel>

              <Input
                id="identityNumber"
                {...form.register("identityNumber")}
                disabled={isSubmitting}
              />

              <FieldError>
                {form.formState.errors.identityNumber?.message}
              </FieldError>
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="bankName">Bank name</FieldLabel>
              <Input
                id="bankName"
                {...form.register("bankName")}
                disabled={isSubmitting}
              />
              <FieldError>{form.formState.errors.bankName?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="bankAccountNumber">
                Bank account number
              </FieldLabel>
              <Input
                id="bankAccountNumber"
                inputMode="numeric"
                {...form.register("bankAccountNumber")}
                disabled={isSubmitting}
              />
              <FieldError>
                {form.formState.errors.bankAccountNumber?.message}
              </FieldError>
            </Field>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
