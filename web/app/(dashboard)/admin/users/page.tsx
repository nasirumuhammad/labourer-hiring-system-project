import type { Metadata } from "next";
import { AdminUserListPage } from "@/components/admin/admin-list-page";
import { ErrorNote } from "@/components/layout/page";
import { adminApi } from "@/lib/admin";
import { ApiError } from "@/lib/api/api-error";

export const metadata: Metadata = {
  title: "Users",
  description: "Search and manage every account on the platform.",
};

const getData = () => adminApi.users();

export default async function UsersPage() {
  let result: Awaited<ReturnType<typeof getData>> | undefined;
  let message: string | null = null;
  try {
    result = await getData();
  } catch (error) {
    message = error instanceof ApiError ? error.message : "Failed to load users";
  }
  if (!result) return <ErrorNote message={message ?? "Failed to load users"} />;
  return <AdminUserListPage title="All users" users={result.data?.data ?? []} />;
}
