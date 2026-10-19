import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Create an account",
  description:
    "Join JobLink as a client looking for work or as an employer hiring skilled trades.",
};

export default function SignupPage() {
  return <SignupForm />;
}
