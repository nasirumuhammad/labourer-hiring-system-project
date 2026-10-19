"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  EmptyState,
  ErrorNote,
  InitialTile,
  LoadingNote,
  PageContainer,
  PageHeader,
  Panel,
} from "@/components/layout/page";
import { Button } from "@/components/ui/button";
import { ApplicationStatusPill } from "@/components/ui/status-pill";
import { ApiError } from "@/lib/api/api-error";
import type { Application } from "@/types/job";
import { jobsApi } from "@/lib/job";

const PAGE_SIZE = 10;

export function JobApplicantsList({
  jobId,
  jobTitle,
}: {
  jobId: string;
  jobTitle?: string;
}) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [decidingId, setDecidingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchApplicants() {
      try {
        setIsLoading(true);
        const response = await jobsApi.applicantsForJob(jobId, page, PAGE_SIZE);
        const next = response?.data?.data ?? [];
        setApplications((current) => (page === 1 ? next : [...current, ...next]));
        setTotal(response?.data?.total ?? 0);
      } catch (err) {
        setError(
          err instanceof ApiError ? err.message : "Failed to load applicants for this job",
        );
      } finally {
        setIsLoading(false);
      }
    }
    fetchApplicants();
  }, [jobId, page]);

  const decide = async (applicationId: string, status: "accepted" | "rejected") => {
    try {
      setDecidingId(applicationId);
      setError(null);
      const response = await jobsApi.updateApplicationStatus(applicationId, status);
      const updated = response?.data;
      if (updated) {
        setApplications((current) =>
          current.map((application) =>
            application.id === applicationId
              ? { ...application, status: updated.status }
              : application,
          ),
        );
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to update this application");
    } finally {
      setDecidingId(null);
    }
  };

  return (
    <PageContainer width="4xl">
      <Link
        href="/employer/jobs"
        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-brand"
      >
        <ArrowLeft className="size-4" /> Back to my jobs
      </Link>
      <PageHeader
        eyebrow={total > 0 ? `${total} applicant${total === 1 ? "" : "s"}` : "Applicants"}
        title={jobTitle ? `Applicants for ${jobTitle}` : "Applicants"}
      />

      {error && <ErrorNote message={error} />}

      {isLoading && applications.length === 0 && <LoadingNote />}
      {!isLoading && !error && applications.length === 0 && (
        <Panel>
          <EmptyState message="No one has applied to this job yet." />
        </Panel>
      )}

      <div className="space-y-4">
        {applications.map((application) => (
          <Panel key={application.id} className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <InitialTile text={application.applicant?.email ?? "A"} />
                <div className="min-w-0">
                  <p className="truncate font-medium text-brand">
                    {application.applicant?.email ?? "Applicant"}
                  </p>
                  <p className="text-xs text-neutral-500">
                    Applied {new Date(application.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <ApplicationStatusPill status={application.status} />
                {application.status === "pending" && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={decidingId === application.id}
                      onClick={() => decide(application.id, "rejected")}
                    >
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      disabled={decidingId === application.id}
                      onClick={() => decide(application.id, "accepted")}
                    >
                      Accept
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="rounded-xl bg-background p-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500">
                Proposal
              </p>
              {/* Sanitized server-side (sanitize-html) before it is stored. */}
              <div
                className="rich-text"
                dangerouslySetInnerHTML={{ __html: application.proposal }}
              />
            </div>
          </Panel>
        ))}
      </div>

      {applications.length < total && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            disabled={isLoading}
            onClick={() => setPage((current) => current + 1)}
          >
            {isLoading ? "Loading..." : "Load more"}
          </Button>
        </div>
      )}
    </PageContainer>
  );
}
