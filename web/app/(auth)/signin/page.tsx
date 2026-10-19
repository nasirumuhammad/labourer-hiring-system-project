import type { Metadata } from "next";
import { SigninForm } from "@/components/auth/signin-form";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to your JobLink account to browse jobs, track applications or manage your listings.",
};

export default async function SigninPage({
  searchParams,
}: {
  searchParams: Promise<{ reset?: string }>;
}) {
  const { reset } = await searchParams;
  return (
    <SigninForm
      notice={
        reset === "success"
          ? "Your password was updated. Sign in with the new one."
          : undefined
      }
    />
  );
}
