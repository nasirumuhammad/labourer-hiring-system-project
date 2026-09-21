"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/api-error";
import type { Application, ApplicationStatus } from "@/types/job";
import { jobsApi } from "@/lib/job";
import { useCurrentUser } from "@/hooks/use-current-user";

const STATUS_VARIANT: Record<
  ApplicationStatus,
  "default" | "secondary" | "success" | "outline"
> = {
  pending: "secondary",
  accepted: "success",
  rejected: "outline",
  withdrawn: "outline",
};

export function JobApplicantsList({
  jobId,
  jobTitle,
}: {
  jobId: string;
  jobTitle?: string;
}) {
  const router = useRouter();
  const { user, isLoading: isLoadingUser } = useCurrentUser();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [decidingId, setDecidingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoadingUser && user && user.role !== "employer") {
      router.replace("/dashboard");
    }
  }, [isLoadingUser, user, router]);

  useEffect(() => {
    async function fetchApplicants() {
      try {
        setIsLoading(true);
        const response = await jobsApi.applicantsForJob(jobId);
        setApplications(response?.data?.data ?? []);
      } catch (err) {
        setError(
          err instanceof ApiError
            ? err.message
            : "Failed to load applicants for this job",
        );
      } finally {
        setIsLoading(false);
      }
    }
    fetchApplicants();
  }, [jobId]);

  const decide = async (
    applicationId: string,
    status: "accepted" | "rejected",
  ) => {
    try {
      setDecidingId(applicationId);
      const response = await jobsApi.updateApplicationStatus(
        applicationId,
        status,
      );
      const updated = response;
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
      setError(
        err instanceof ApiError
          ? err.message
          : "Failed to update this application",
      );
    } finally {
      setDecidingId(null);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 p-4">
      <div>
        <Link
          href="/employer/jobs"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to My Jobs
        </Link>
        <h1 className="text-2xl font-bold">
          Applicants{jobTitle ? ` for ${jobTitle}` : ""}
        </h1>
      </div>

      {(isLoading || isLoadingUser) && (
        <p className="text-sm text-muted-foreground">Loading...</p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {!isLoading && !error && applications.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No one has applied to this job yet.
        </p>
      )}

      {applications.map((application) => (
        <Card
          key={application.id}
          className="flex-row items-center justify-between p-4"
        >
          <div>
            <p className="font-medium">
              {application.applicant?.email ?? "Applicant"}
            </p>
            <p className="text-sm text-muted-foreground">
              Applied {new Date(application.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={STATUS_VARIANT[application.status]}>
              {application.status}
            </Badge>
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
        </Card>
      ))}
    </div>
  );
}
