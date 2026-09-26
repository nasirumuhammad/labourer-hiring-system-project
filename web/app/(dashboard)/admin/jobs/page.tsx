import AdminJobsView from "@/components/admin/admin-job-view";
import { adminApi } from "@/lib/admin";
import { ApiError } from "@/lib/api/api-error";

export default async function AdminJobsPage() {
  const jobs = await adminApi.jobs();
  try {
    return <AdminJobsView initialJobs={jobs?.data?.data ?? []} />;
  } catch (error) {
    const message =
      error instanceof ApiError ? error.message : "Failed to load jobs";
    return <p className="text-sm text-destructive">{message}</p>;
  }
}
