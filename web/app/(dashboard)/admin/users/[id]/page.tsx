import AdminUserDetailView from "@/components/admin/user-profile-view";
import { adminApi } from "@/lib/admin";
import { ApiError } from "next/dist/server/api-utils";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const { id } = await params;
    const data = await adminApi.user(id);
    return <AdminUserDetailView data={data?.data} />;
  } catch (error) {
    const message =
      error instanceof ApiError ? error.message : "Failed to load user";
    return <p className="text-sm text-destructive">{message}</p>;
  }
}
