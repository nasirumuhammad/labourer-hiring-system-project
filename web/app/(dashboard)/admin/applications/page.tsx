import type { Metadata } from "next";
import { AdminApplicationsView } from "@/components/admin/admin-application-view";
import { ErrorNote } from "@/components/layout/page";
import { adminApi } from "@/lib/admin";
import { ApiError } from "@/lib/api/api-error";

export const metadata: Metadata = {
  title: "Applications",
  description: "Monitor and moderate submitted applications.",
};

const getData = () => adminApi.applications({ limit: 50 });

export default async function AdminApplicationsPage() {
  let result: Awaited<ReturnType<typeof getData>> | undefined;
  let message: string | null = null;
  try {
    result = await getData();
  } catch (error) {
    message = error instanceof ApiError ? error.message : "Failed to load applications";
  }
  if (!result) return <ErrorNote message={message ?? "Failed to load applications"} />;
  return <AdminApplicationsView applications={result.data?.data ?? []} />;
}
