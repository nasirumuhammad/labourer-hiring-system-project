"use client";

import { useState } from "react";
import { JobStatus } from "@labour-hiring/enums";
import { AdminHeading, FilterBar, selectClass } from "@/components/admin/admin-ui";
import { EmptyState, ErrorNote, LoadingNote, Panel } from "@/components/layout/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { JobStatusPill } from "@/components/ui/status-pill";
import { adminApi } from "@/lib/admin";
import type { AdminJob } from "@/types/admin";

export default function AdminJobsView({ initialJobs }: { initialJobs: AdminJob[] }) {
  const [override, setJobs] = useState<AdminJob[] | null>(null);
  const jobs = override ?? initialJobs;
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<JobStatus | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await adminApi.jobs({
        search,
        status: status || undefined,
        limit: 50,
      });
      setJobs(result?.data?.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const toggle = async (job: AdminJob) => {
    setError(null);
    try {
      await adminApi.setJobStatus(
        job.id,
        job.status === JobStatus.OPEN ? JobStatus.CLOSED : JobStatus.OPEN,
      );
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update job status");
    }
  };

  const remove = async (job: AdminJob) => {
    setError(null);
    try {
      await adminApi.deleteJob(job.id);
      setConfirmingId(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete job");
    }
  };

  return (
    <div className="space-y-5">
      <AdminHeading title="Jobs" description="Moderate all job postings." />

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void load();
        }}
      >
        <FilterBar>
          <Input
            aria-label="Search jobs"
            placeholder="Search jobs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            aria-label="Filter by status"
            className={selectClass}
            value={status}
            onChange={(e) => setStatus(e.target.value as JobStatus | "")}
          >
            <option value="">All status</option>
            {Object.values(JobStatus).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <Button type="submit" className="h-11">
            Search
          </Button>
        </FilterBar>
      </form>

      {error && <ErrorNote message={error} />}
      {loading && <LoadingNote />}
      {!loading && jobs.length === 0 && (
        <Panel>
          <EmptyState message="No jobs found." />
        </Panel>
      )}

      {!loading && (
        <div className="space-y-3">
          {jobs.map((job) => (
            <Panel key={job.id}>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-brand">{job.title}</span>
                    <JobStatusPill status={job.status} />
                    <Badge variant="outline">{job.paymentType}</Badge>
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-500">{job.companyName}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-neutral-600">{job.description}</p>
                </div>
                <div className="flex flex-wrap gap-2 lg:shrink-0">
                  {(job.status === JobStatus.OPEN || job.status === JobStatus.CLOSED) && (
                    <Button size="sm" variant="outline" onClick={() => void toggle(job)}>
                      {job.status === JobStatus.OPEN ? "Close" : "Reopen"}
                    </Button>
                  )}
                  {confirmingId === job.id ? (
                    <>
                      <Button size="sm" variant="destructive" onClick={() => void remove(job)}>
                        Yes, delete
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setConfirmingId(null)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" variant="destructive" onClick={() => setConfirmingId(job.id)}>
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}
