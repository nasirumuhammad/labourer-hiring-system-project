import type { Metadata } from "next";
import AdminDashboardPage from "@/components/admin/dashboard";
import { ErrorNote } from "@/components/layout/page";
import { adminApi } from "@/lib/admin";
import { ApiError } from "@/lib/api/api-error";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Platform overview: users, jobs and applications at a glance.",
};

const getData = () => adminApi.dashboard();

export default async function AdminDashboard() {
  let result: Awaited<ReturnType<typeof getData>> | undefined;
  let message: string | null = null;
  try {
    result = await getData();
  } catch (error) {
    message = error instanceof ApiError ? error.message : "Failed to load the dashboard";
  }
  if (!result) return <ErrorNote message={message ?? "Failed to load the dashboard"} />;
  return <AdminDashboardPage data={result.data} />;
}
