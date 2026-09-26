import AuditLogsView from "@/components/admin/audit-log-view";
import { adminApi } from "@/lib/admin";
import { ApiError } from "@/lib/api/api-error";

export default async function AuditLogsPage() {
  try {
    const auditLogs = await adminApi.auditLogs();
    return <AuditLogsView data={auditLogs?.data?.data ?? []} />;
  } catch (error) {
    const message =
      error instanceof ApiError ? error.message : "Failed to load audit log";
  }
}
