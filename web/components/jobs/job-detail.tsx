"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiError } from "@/lib/api/api-error";
import { ApplyJobForm } from "./apply-job-form";
import type { Job } from "@/types/job";
import { jobsApi } from "@/lib/job";

export function JobDetail({ jobId }: { jobId: string }) {
  const [job, setJob] = useState<Job | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchJob() {
      try {
        setIsLoading(true);
        const response = await jobsApi.getById(jobId);
        setJob(response?.data ?? null);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Failed to load job");
      } finally {
        setIsLoading(false);
      }
    }
    fetchJob();
  }, [jobId]);

  if (isLoading) {
    return <p className="p-6 text-sm text-muted-foreground">Loading...</p>;
  }

  if (error || !job) {
    return (
      <p className="p-6 text-sm text-destructive">{error ?? "Job not found"}</p>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{job.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {job.companyName}
            {job.location ? ` · ${job.location}` : ""}
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm">{job.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {job.skills.map((skill) => (
              <Badge key={skill} variant="outline">
                {skill}
              </Badge>
            ))}
            {job.minExperienceYears > 0 && (
              <Badge variant="success">{job.minExperienceYears}+ years</Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Apply for this job</CardTitle>
        </CardHeader>
        <CardContent>
          <ApplyJobForm jobId={job.id} />
        </CardContent>
      </Card>
    </div>
  );
}
