"use client";

import { AdminHeading, DataTable, cell } from "@/components/admin/admin-ui";
import { EmptyState, Panel } from "@/components/layout/page";
import type { AuditLog } from "@/types/admin";

export default function AuditLogsView({ data }: { data: AuditLog[] }) {
  return (
    <div className="space-y-5">
      <AdminHeading
        title="Audit logs"
        description="Administrative actions recorded by the platform."
      />

      {data.length === 0 && (
        <Panel>
          <EmptyState message="No admin actions recorded yet." />
        </Panel>
      )}

      {data.length > 0 && (
        <>
          <ul className="space-y-3 md:hidden">
            {data.map((log) => (
              <li key={log.id} className="rounded-2xl border border-black/5 bg-white p-4 text-sm">
                <p className="font-medium text-brand">{log.action}</p>
                <p className="mt-0.5 text-xs text-neutral-500">
                  {log.entityType}
                  {log.entityId ? ` · ${log.entityId}` : ""}
                </p>
                <p className="mt-2 break-all text-xs text-neutral-500">Admin: {log.adminId}</p>
                <p className="mt-1 text-xs text-neutral-400">
                  {new Date(log.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>

          <DataTable
            className="hidden md:block"
            head={["Action", "Entity", "Entity ID", "Admin ID", "Date"]}
          >
            {data.map((log) => (
              <tr key={log.id} className="hover:bg-background/60">
                <td className={`${cell} font-medium text-brand`}>{log.action}</td>
                <td className={cell}>{log.entityType}</td>
                <td className={`${cell} max-w-[12rem] truncate`}>{log.entityId ?? "—"}</td>
                <td className={`${cell} max-w-[12rem] truncate`}>{log.adminId}</td>
                <td className={`${cell} whitespace-nowrap`}>
                  {new Date(log.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </DataTable>
        </>
      )}
    </div>
  );
}
