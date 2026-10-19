import type { Metadata } from "next";
import { UserRole } from "@labour-hiring/enums";
import { AdminUserListPage } from "@/components/admin/admin-list-page";
import { ErrorNote } from "@/components/layout/page";
import { adminApi } from "@/lib/admin";
import { ApiError } from "@/lib/api/api-error";

export const metadata: Metadata = {
  title: "Clients",
  description: "Accounts of people looking for work.",
};

const getData = () => adminApi.users({ role: UserRole.CLIENT });

export default async function ClientsPage() {
  let result: Awaited<ReturnType<typeof getData>> | undefined;
  let message: string | null = null;
  try {
    result = await getData();
  } catch (error) {
    message = error instanceof ApiError ? error.message : "Failed to load clients";
  }
  if (!result) return <ErrorNote message={message ?? "Failed to load clients"} />;
  return <AdminUserListPage title="Clients" users={result.data?.data ?? []} role={UserRole.CLIENT} />;
}
