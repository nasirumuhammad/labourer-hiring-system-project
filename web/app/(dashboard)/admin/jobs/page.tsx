import type { Metadata } from "next";
import AdminJobsView from "@/components/admin/admin-job-view";
import { ErrorNote } from "@/components/layout/page";
import { adminApi } from "@/lib/admin";
import { ApiError } from "@/lib/api/api-error";

export const metadata: Metadata = {
  title: "Jobs",
  description: "Moderate every job posting on the platform.",
};

const getData = () => adminApi.jobs();

export default async function AdminJobsPage() {
  let result: Awaited<ReturnType<typeof getData>> | undefined;
  let message: string | null = null;
  try {
    result = await getData();
  } catch (error) {
    message = error instanceof ApiError ? error.message : "Failed to load jobs";
  }
  if (!result) return <ErrorNote message={message ?? "Failed to load jobs"} />;
  return <AdminJobsView initialJobs={result.data?.data ?? []} />;
}
