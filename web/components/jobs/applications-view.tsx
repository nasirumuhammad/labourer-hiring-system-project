"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
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
import {
  useApplicationStatusStream,
  type ApplicationStatusUpdate,
} from "@/hooks/use-application-status-stream";

const PAGE_SIZE = 10;

export function ApplicationsView() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchApplications() {
      try {
        setIsLoading(true);
        const response = await jobsApi.myApplications(page, PAGE_SIZE);
        const next = response?.data?.data ?? [];
        setApplications((current) => (page === 1 ? next : [...current, ...next]));
        setTotal(response?.data?.total ?? 0);
      } catch (err) {
        setError(
          err instanceof ApiError ? err.message : "Failed to load your applications",
        );
      } finally {
        setIsLoading(false);
      }
    }
    fetchApplications();
  }, [page]);

  const handleStatusUpdate = useCallback((update: ApplicationStatusUpdate) => {
    setApplications((current) =>
      current.map((application) =>
        application.id === update.applicationId
          ? { ...application, status: update.status }
          : application,
      ),
    );
  }, []);

  useApplicationStatusStream(handleStatusUpdate);

  return (
    <PageContainer width="4xl">
      <PageHeader
        eyebrow="Applications"
        title="My applications"
        description="Statuses update here as soon as an employer responds."
      />

      {error && <ErrorNote message={error} />}

      <Panel>
        {isLoading && applications.length === 0 && <LoadingNote />}
        {!isLoading && !error && applications.length === 0 && (
          <EmptyState message="You haven't applied to any jobs yet." />
        )}

        <ul className="divide-y divide-black/5">
          {applications.map((application) => (
            <li
              key={application.id}
              className="flex items-center gap-3 px-1 py-4 sm:gap-4"
            >
              <InitialTile text={application.job?.companyName ?? "J"} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-brand">
                  {application.job ? (
                    <Link href={`/jobs/${application.job.id}`} className="hover:underline">
                      {application.job.title}
                    </Link>
                  ) : (
                    "Job listing"
                  )}
                </p>
                <p className="truncate text-xs text-neutral-500">
                  {application.job?.companyName ?? "—"} · Applied{" "}
                  {new Date(application.createdAt).toLocaleDateString()}
                </p>
              </div>
              <ApplicationStatusPill status={application.status} />
            </li>
          ))}
        </ul>

        {applications.length < total && (
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
