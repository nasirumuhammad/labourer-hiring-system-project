"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ApiError } from "@/lib/api/api-error";
import type { Application } from "@/types/job";
import { jobsApi } from "@/lib/job";
import { useCallback } from "react";
import {
  useApplicationStatusStream,
  type ApplicationStatusUpdate,
} from "@/hooks/use-application-status-stream";

const STATUS_VARIANT: Record<
  Application["status"],
  "default" | "secondary" | "success" | "outline"
> = {
  pending: "secondary",
  accepted: "success",
  rejected: "outline",
  withdrawn: "outline",
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchApplications() {
      try {
        setIsLoading(true);
        const response = await jobsApi.myApplications();
        setApplications(response?.data?.data ?? []);
      } catch (err) {
        setError(
          err instanceof ApiError
            ? err.message
            : "Failed to load your applications",
        );
      } finally {
        setIsLoading(false);
      }
    }
    fetchApplications();
  }, []);

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
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">My Applications</h1>

      {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {!isLoading && !error && applications.length === 0 && (
        <p className="text-sm text-muted-foreground">
          You haven&apos;t applied to any jobs yet.
        </p>
      )}

      {applications.map((application) => (
        <Card
          key={application.id}
          className="flex-row items-center justify-between p-4"
        >
          <div>
            <p className="font-medium">
              {application.job?.title ?? "Job listing"}
            </p>
            <p className="text-sm text-muted-foreground">
              {application.job?.companyName}
            </p>
          </div>
          <Badge variant={STATUS_VARIANT[application.status]}>
            {application.status}
          </Badge>
        </Card>
      ))}
    </div>
  );
}
