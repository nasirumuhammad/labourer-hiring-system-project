"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Pencil, Plus, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import {
  EmptyState,
  ErrorNote,
  InitialTile,
  LoadingNote,
  PageContainer,
  PageHeader,
  Panel,
} from "@/components/layout/page";
import { Button, buttonVariants } from "@/components/ui/button";
import { JobStatusPill } from "@/components/ui/status-pill";
import { ApiError } from "@/lib/api/api-error";
import type { Job } from "@/types/job";
import { jobsApi } from "@/lib/job";
import { cn } from "cn";

const PAGE_SIZE = 10;

export function EmployerJobsView() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJobs() {
      try {
        setIsLoading(true);
        const response = await jobsApi.mine(page, PAGE_SIZE);
        const next = response?.data?.data ?? [];
        setJobs((current) => (page === 1 ? next : [...current, ...next]));
        setTotal(response?.data?.total ?? 0);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Failed to load your jobs");
      } finally {
        setIsLoading(false);
      }
    }
    fetchJobs();
  }, [page]);

  async function handleDelete(job: Job) {
    try {
      setDeletingId(job.id);
      await jobsApi.remove(job.id);
      setJobs((current) => current.filter((j) => j.id !== job.id));
      setTotal((current) => Math.max(0, current - 1));
      toast.success("Job deleted");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete job");
    } finally {
      setDeletingId(null);
      setConfirmingId(null);
    }
  }

  return (
    <PageContainer width="4xl">
      <PageHeader
        eyebrow="Employer"
        title="My jobs"
        description="Review applicants, edit a listing, or take it down."
        action={
          <Link href="/employer/jobs/new" className={cn(buttonVariants())}>
            <Plus /> Post a job
          </Link>
        }
      />

      {error && <ErrorNote message={error} />}

      <Panel>
        {isLoading && jobs.length === 0 && <LoadingNote />}
        {!isLoading && !error && jobs.length === 0 && (
          <EmptyState message="You haven't posted any jobs yet." />
        )}

        <ul className="divide-y divide-black/5">
          {jobs.map((job) => {
            const confirming = confirmingId === job.id;
            return (
              <li
                key={job.id}
                className="flex flex-col gap-3 px-1 py-4 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                  <InitialTile text={job.companyName} />
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="font-medium text-brand">{job.title}</span>
                      <JobStatusPill status={job.status} />
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-neutral-500">
                      {job.companyName}
                      {job.location && (
                        <>
                          <span aria-hidden>·</span>
                          <MapPin aria-hidden className="size-3 shrink-0" />
                          <span className="truncate">{job.location}</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 lg:shrink-0 lg:justify-end">
                  {confirming ? (
                    <>
                      <span className="text-sm text-neutral-500">Delete this job?</span>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={deletingId === job.id}
                        onClick={() => handleDelete(job)}
                      >
                        {deletingId === job.id ? "Deleting..." : "Yes, delete"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setConfirmingId(null)}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link
                        href={`/employer/jobs/${job.id}/applicants?title=${encodeURIComponent(job.title)}`}
                        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                      >
                        <Users /> Applicants
                      </Link>
                      <Link
                        href={`/employer/jobs/${job.id}/edit`}
                        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                      >
                        <Pencil /> Edit
                      </Link>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setConfirmingId(job.id)}
                      >
                        <Trash2 /> Delete
                      </Button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        {jobs.length < total && (
          <div className="flex justify-center pt-4">
            <Button
              variant="outline"
              disabled={isLoading}
              onClick={() => setPage((current) => current + 1)}
            >
              {isLoading ? "Loading..." : "Load more"}
            </Button>
          </div>
        )}
      </Panel>
    </PageContainer>
  );
}
