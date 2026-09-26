import { AdminApplicationsView } from "@/components/admin/admin-application-view";
import { adminApi } from "@/lib/admin";
import { ApiError } from "@/lib/api/api-error";

export default async function AdminApplicationsPage() {
  const response = await adminApi.applications({ limit: 50 });
  try {
    return <AdminApplicationsView applications={response?.data?.data ?? []} />;
  } catch (error) {
    const message =
      error instanceof ApiError ? error.message : "Failed to load applications";
    return <p className="text-sm text-destructive">{message}</p>;
  }
}
