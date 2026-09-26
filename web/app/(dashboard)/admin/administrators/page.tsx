import AdministratorsListView from "@/components/admin/administrators-list-view";
import { adminApi } from "@/lib/admin";
import { ApiError } from "@/lib/api/api-error";
import { UserRole } from "@labour-hiring/enums";

export default async function AdministratorsPage() {
  try {
    const administrators = await adminApi.users({ role: UserRole.ADMIN });
    return (
      <AdministratorsListView
        administrators={administrators?.data?.data ?? []}
      />
    );
  } catch (error) {
    const message =
      error instanceof ApiError
        ? error.message
        : "Failed to load administrators";
    return <p className="text-sm text-destructive">{message}</p>;
  }
}
