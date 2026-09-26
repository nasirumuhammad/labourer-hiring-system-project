import AdminDashboardPage from "@/components/admin/dashboard";
import { adminApi } from "@/lib/admin";

export default async function AdminDashboard() {
  const data = await adminApi.dashboard();
  return <AdminDashboardPage data={data?.data} />;
}
