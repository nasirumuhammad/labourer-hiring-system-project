import type { Metadata } from "next";
import { UserRole } from "@labour-hiring/enums";
import { AdminUserListPage } from "@/components/admin/admin-list-page";
import { ErrorNote } from "@/components/layout/page";
import { adminApi } from "@/lib/admin";
import { ApiError } from "@/lib/api/api-error";

export const metadata: Metadata = {
  title: "Employers",
  description: "Accounts of employers who post jobs.",
};

const getData = () => adminApi.users({ role: UserRole.EMPLOYER });

export default async function EmployersPage() {
  let result: Awaited<ReturnType<typeof getData>> | undefined;
  let message: string | null = null;
  try {
    result = await getData();
  } catch (error) {
    message = error instanceof ApiError ? error.message : "Failed to load employers";
  }
  if (!result) return <ErrorNote message={message ?? "Failed to load employers"} />;
  return <AdminUserListPage title="Employers" users={result.data?.data ?? []} role={UserRole.EMPLOYER} />;
}
