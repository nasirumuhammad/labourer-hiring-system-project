"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PostJobForm } from "@/components/jobs/post-job-form";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function NewJobPage() {
  const router = useRouter();
  const { user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && user && user.role !== "employer") {
      router.replace("/dashboard");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Post a Job</h1>
      <p className="text-sm text-muted-foreground">
        Fill in the details below. Your listing goes live as soon as you post
        it.
      </p>
      <PostJobForm />
    </div>
  );
}
