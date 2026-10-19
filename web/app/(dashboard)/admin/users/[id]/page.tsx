import type { Metadata } from "next";
import AdminUserDetailView from "@/components/admin/user-profile-view";
import { ErrorNote } from "@/components/layout/page";
import { adminApi } from "@/lib/admin";
import { ApiError } from "@/lib/api/api-error";

export const metadata: Metadata = {
  title: "User details",
  description: "View a user's profile, jobs and applications, and manage their account.",
};

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let result: Awaited<ReturnType<typeof adminApi.user>> | undefined;
  let message: string | null = null;
  try {
    result = await adminApi.user(id);
  } catch (error) {
    message = error instanceof ApiError ? error.message : "Failed to load user";
  }
  if (!result) return <ErrorNote message={message ?? "Failed to load user"} />;
  return <AdminUserDetailView data={result.data} />;
}
