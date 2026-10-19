import type { Metadata } from "next";
import { UserRole } from "@labour-hiring/enums";
import AdministratorsListView from "@/components/admin/administrators-list-view";
import { ErrorNote } from "@/components/layout/page";
import { adminApi } from "@/lib/admin";
import { ApiError } from "@/lib/api/api-error";

export const metadata: Metadata = {
  title: "Administrators",
  description: "Create and review administrator accounts.",
};

const getData = () => adminApi.users({ role: UserRole.ADMIN });

export default async function AdministratorsPage() {
  let result: Awaited<ReturnType<typeof getData>> | undefined;
  let message: string | null = null;
  try {
    result = await getData();
  } catch (error) {
    message = error instanceof ApiError ? error.message : "Failed to load administrators";
  }
  if (!result) return <ErrorNote message={message ?? "Failed to load administrators"} />;
  return <AdministratorsListView administrators={result.data?.data ?? []} />;
}
