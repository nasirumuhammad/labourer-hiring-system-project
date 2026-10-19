"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import {
  ErrorNote,
  LoadingNote,
  PageContainer,
  PageHeader,
  Panel,
} from "@/components/layout/page";
import { PostJobForm } from "@/components/jobs/post-job-form";
import { ApiError } from "@/lib/api/api-error";
import { jobsApi } from "@/lib/job";
import type { MyJob } from "@/types/job";

export function EditJobView({ jobId }: { jobId: string }) {
  const [job, setJob] = useState<MyJob | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const response = await jobsApi.mineOne(jobId);
        setJob(response?.data ?? null);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Failed to load job");
      }
    }
    load();
  }, [jobId]);

  const priceLocked = (job?.applicantCount ?? 0) > 0;

  return (
    <PageContainer width="3xl">
      <Link
        href="/employer/jobs"
        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-brand"
      >
        <ArrowLeft className="size-4" /> Back to my jobs
      </Link>
      <PageHeader eyebrow="Employer" title="Edit job" />

      {priceLocked && (
        <div className="flex items-start gap-3 rounded-2xl bg-violet-soft p-4 text-sm text-violet-ink">
          <Lock aria-hidden className="mt-0.5 size-4 shrink-0" />
          <p>
            Pay is locked because {job?.applicantCount}{" "}
            {job?.applicantCount === 1 ? "person has" : "people have"} already
            applied. You can still change the title, description, location and
            skills.
          </p>
        </div>
      )}

      {error && <ErrorNote message={error} />}
      {!job && !error && <LoadingNote />}
      {job && (
        <Panel className="p-5 sm:p-6">
          <PostJobForm job={job} priceLocked={priceLocked} />
        </Panel>
      )}
    </PageContainer>
  );
}
