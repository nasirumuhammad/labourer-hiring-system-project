"use client";

import { useState } from "react";
import Link from "next/link";
import { UserRole } from "@labour-hiring/enums";
import { AdminHeading, DataTable, FilterBar, cell, selectClass } from "@/components/admin/admin-ui";
import { EmptyState, ErrorNote, LoadingNote, Panel } from "@/components/layout/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminApi } from "@/lib/admin";
import { ApiError } from "@/lib/api/api-error";
import type { AdminUser } from "@/types/admin";

const nameOf = (user: AdminUser) =>
  user.profile ? `${user.profile.firstName} ${user.profile.lastName}` : "—";

function StatusBadge({ user }: { user: AdminUser }) {
  return user.deletedAt ? (
    <Badge variant="outline">Deactivated</Badge>
  ) : (
    <Badge variant="success">Active</Badge>
  );
}

export function AdminUserListPage({
  role,
  title,
  users: initialUsers,
}: {
  role?: UserRole;
  title: string;
  users: AdminUser[];
}) {
  const [override, setUsers] = useState<AdminUser[] | null>(null);
  const users = override ?? initialUsers;
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"active" | "deactivated" | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.users({
        role,
        search,
        status: status || undefined,
        limit: 20,
      });
      setUsers(response?.data?.data ?? []);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <AdminHeading title={title} description="Manage platform accounts." />

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void load();
        }}
      >
        <FilterBar>
          <Input
            aria-label="Search by name or email"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            aria-label="Filter by status"
            className={selectClass}
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
          >
            <option value="">All status</option>
            <option value="active">Active</option>
            <option value="deactivated">Deactivated</option>
          </select>
          <Button type="submit" className="h-11">
            Search
          </Button>
        </FilterBar>
      </form>

      {error && <ErrorNote message={error} />}
      {loading && <LoadingNote />}

      {!loading && users.length === 0 && (
        <Panel>
          <EmptyState message="No users found." />
        </Panel>
      )}

      {!loading && users.length > 0 && (
        <>
          {/* Phones: stacked cards */}
          <ul className="space-y-3 md:hidden">
            {users.map((user) => (
              <li key={user.id} className="rounded-2xl border border-black/5 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-brand">{nameOf(user)}</p>
                    <p className="truncate text-xs text-neutral-500">{user.email}</p>
                  </div>
                  <StatusBadge user={user} />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-neutral-500">
                  <span className="capitalize">
                    {user.role} · {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                  <Link className="font-medium text-link hover:underline" href={`/admin/users/${user.id}`}>
                    View
                  </Link>
                </div>
              </li>
            ))}
          </ul>

          {/* md and up: table */}
          <DataTable
            className="hidden md:block"
            head={["Name", "Email", "Role", "Status", "Created", ""]}
          >
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-background/60">
                <td className={`${cell} font-medium text-brand`}>{nameOf(user)}</td>
                <td className={cell}>{user.email}</td>
                <td className={`${cell} capitalize`}>{user.role}</td>
                <td className={cell}>
                  <StatusBadge user={user} />
                </td>
                <td className={cell}>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className={`${cell} text-right`}>
                  <Link className="font-medium text-link hover:underline" href={`/admin/users/${user.id}`}>
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </DataTable>
        </>
      )}
    </div>
  );
}
