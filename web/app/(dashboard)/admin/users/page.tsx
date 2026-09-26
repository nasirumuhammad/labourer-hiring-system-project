import { AdminUserListPage } from "@/components/admin/admin-list-page";
import { adminApi } from "@/lib/admin";
import { ApiError } from "@/lib/api/api-error";

export default async function UsersPage() {
  try {
    const response = await adminApi.users();
    return (
      <AdminUserListPage title="All Users" users={response?.data?.data ?? []} />
    );
  } catch (error) {
    const message =
      error instanceof ApiError ? error.message : "Failed to load users";
    return <p className="text-sm text-destructive">{message}</p>;
  }
}
