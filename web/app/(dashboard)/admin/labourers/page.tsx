import { AdminUserListPage } from "@/components/admin/admin-list-page";
import { adminApi } from "@/lib/admin";
import { ApiError } from "@/lib/api/api-error";
import { UserRole } from "@labour-hiring/enums";
export default async function LabourersPage() {
  try {
    const labourers = await adminApi.users({ role: UserRole.LABOURER });
    return (
      <AdminUserListPage
        title="Labourers"
        users={labourers?.data?.data ?? []}
      />
    );
  } catch (error) {
    const message =
      error instanceof ApiError ? error.message : "Failed to load labourers";
    return <p className="text-sm text-destructive">{message}</p>;
  }
}
