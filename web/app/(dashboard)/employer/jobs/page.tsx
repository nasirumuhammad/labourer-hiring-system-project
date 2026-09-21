"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { ApiError } from "@/lib/api/api-error";
import type { Job } from "@/types/job";
import { jobsApi } from "@/lib/job";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "cn";

const STATUS_VARIANT: Record<
  Job["status"],
  "default" | "secondary" | "success" | "outline"
> = {
  open: "success",
  closed: "outline",
  draft: "secondary",
};

export default function EmployerJobsPage() {
  const router = useRouter();
  const { user, isLoading: isLoadingUser } = useCurrentUser();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoadingUser && user && user.role !== "employer") {
      router.replace("/dashboard");
    }
  }, [isLoadingUser, user, router]);

  useEffect(() => {
    async function fetchJobs() {
      try {
        setIsLoading(true);
        const response = await jobsApi.mine();
        setJobs(response?.data?.data ?? []);
      } catch (err) {
        setError(
          err instanceof ApiError ? err.message : "Failed to load your jobs",
        );
      } finally {
        setIsLoading(false);
      }
    }
    fetchJobs();
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Jobs</h1>
        <Link href="/employer/jobs/new" className={cn(buttonVariants())}>
          Post a Job
        </Link>
      </div>

      {(isLoading || isLoadingUser) && (
        <p className="text-sm text-muted-foreground">Loading...</p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {!isLoading && !error && jobs.length === 0 && (
        <p className="text-sm text-muted-foreground">
          You haven&apos;t posted any jobs yet.
        </p>
      )}

      {jobs.map((job) => (
        <Card
          key={job.id}
          className="flex-row items-center justify-between p-4"
        >
          <div>
            <p className="font-medium">{job.title}</p>
            <p className="text-sm text-muted-foreground">
              {job.companyName}
              {job.location ? ` · ${job.location}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={STATUS_VARIANT[job.status]}>{job.status}</Badge>
            <Link
              href={`/employer/jobs/${job.id}/applicants?title=${encodeURIComponent(job.title)}`}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              View Applicants
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
}
