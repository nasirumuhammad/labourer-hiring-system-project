import { AdminUserListPage } from "@/components/admin/admin-list-page";
import { adminApi } from "@/lib/admin";
import { ApiError } from "@/lib/api/api-error";
import { UserRole } from "@labour-hiring/enums";
export default async function EmployersPage() {
  try {
    const employers = await adminApi.users({ role: UserRole.EMPLOYER });
    return (
      <AdminUserListPage
        title="Employers"
        users={employers?.data?.data ?? []}
        role={UserRole.EMPLOYER}
      />
    );
  } catch (error) {
    const message =
      error instanceof ApiError ? error.message : "Failed to load employers";
    return <p className="text-sm text-destructive">{message}</p>;
  }
}
