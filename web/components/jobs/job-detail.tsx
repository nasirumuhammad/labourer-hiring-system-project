"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Briefcase, MapPin, Wallet } from "lucide-react";
import {
  ErrorNote,
  InitialTile,
  LoadingNote,
  PageContainer,
  Panel,
} from "@/components/layout/page";
import { Badge } from "@/components/ui/badge";
import { ApiError } from "@/lib/api/api-error";
import { formatPay } from "@/lib/format-pay";
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
    return (
      <PageContainer width="4xl">
        <LoadingNote />
      </PageContainer>
    );
  }

  if (error || !job) {
    return (
      <PageContainer width="4xl">
        <ErrorNote message={error ?? "Job not found"} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Link
        href="/jobs"
        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-brand"
      >
        <ArrowLeft className="size-4" /> Back to jobs
      </Link>

      <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
        <div className="space-y-6 lg:col-span-2">
          <Panel className="p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <InitialTile text={job.companyName} className="size-14 text-base" />
              <div className="min-w-0">
                <h1 className="text-xl font-semibold tracking-tight text-brand sm:text-2xl">
                  {job.title}
                </h1>
                <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-sm text-neutral-500">
                  {job.companyName}
                  {job.location && (
                    <>
                      <span aria-hidden>·</span>
                      <MapPin aria-hidden className="size-3.5" /> {job.location}
                    </>
                  )}
                </p>
              </div>
            </div>

            <dl className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl bg-background p-3">
                <Wallet aria-hidden className="size-5 text-link" />
                <div>
                  <dt className="text-xs text-neutral-500">Pay</dt>
                  <dd className="text-sm font-medium text-brand">{formatPay(job)}</dd>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-background p-3">
                <Briefcase aria-hidden className="size-5 text-link" />
                <div>
                  <dt className="text-xs text-neutral-500">Experience</dt>
                  <dd className="text-sm font-medium text-brand">
                    {job.minExperienceYears > 0
                      ? `${job.minExperienceYears}+ years`
                      : "No minimum"}
                  </dd>
                </div>
              </div>
            </dl>
          </Panel>

          <Panel className="p-5 sm:p-6">
            <h2 className="font-semibold text-brand">About this job</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-neutral-600">
              {job.description}
            </p>
            {job.skills.length > 0 && (
              <>
                <h3 className="mt-6 text-sm font-medium text-brand">Skills</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {job.skills.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </>
            )}
          </Panel>
        </div>

        <Panel className="p-5 sm:p-6 lg:sticky lg:top-24">
          <h2 className="font-semibold text-brand">Apply for this job</h2>
          <p className="mb-4 mt-1 text-sm text-neutral-500">
            Tell {job.companyName} why you are a good fit.
          </p>
          <ApplyJobForm jobId={job.id} />
        </Panel>
      </div>
    </PageContainer>
  );
}
