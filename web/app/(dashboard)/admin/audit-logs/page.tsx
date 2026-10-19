import type { Metadata } from "next";
import AuditLogsView from "@/components/admin/audit-log-view";
import { ErrorNote } from "@/components/layout/page";
import { adminApi } from "@/lib/admin";
import { ApiError } from "@/lib/api/api-error";

export const metadata: Metadata = {
  title: "Audit logs",
  description: "Administrative actions recorded by the platform.",
};

const getData = () => adminApi.auditLogs();

export default async function AuditLogsPage() {
  let result: Awaited<ReturnType<typeof getData>> | undefined;
  let message: string | null = null;
  try {
    result = await getData();
  } catch (error) {
    message = error instanceof ApiError ? error.message : "Failed to load the audit log";
  }
  if (!result) return <ErrorNote message={message ?? "Failed to load the audit log"} />;
  return <AuditLogsView data={result.data?.data ?? []} />;
}
