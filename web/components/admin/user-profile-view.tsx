"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ErrorNote, Panel } from "@/components/layout/page";
import { Button } from "@/components/ui/button";
import { ApplicationStatusPill, JobStatusPill } from "@/components/ui/status-pill";
import { adminApi } from "@/lib/admin";
import type { AdminUserDetail } from "@/types/admin";

const HIDDEN_KEYS = new Set(["id", "userId", "createdAt", "updatedAt", "deletedAt"]);

const humanize = (key: string) =>
  key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (c) => c.toUpperCase());

export default function AdminUserDetailView({ data }: { data: AdminUserDetail | undefined }) {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!data) return <p className="text-sm text-neutral-500">Loading...</p>;
  const user = data.user;

  const toggle = async () => {
    setBusy(true);
    setError(null);
    try {
      await (user.deletedAt ? adminApi.reactivateUser(id) : adminApi.deactivateUser(id));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update this account");
    } finally {
      setBusy(false);
    }
  };

  const profileEntries = Object.entries(user.profile ?? {}).filter(
    ([key, value]) => !HIDDEN_KEYS.has(key) && value !== null && typeof value !== "object",
  );

  return (
    <div className="space-y-6">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-brand"
      >
        <ArrowLeft className="size-4" /> Back to users
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-brand sm:text-3xl">
            {user.profile ? `${user.profile.firstName} ${user.profile.lastName}` : user.email}
          </h1>
          <p className="mt-1 break-all text-sm capitalize text-neutral-500">
            {user.email} · {user.role}
            {user.deletedAt ? " · Deactivated" : ""}
          </p>
        </div>
        <Button
          variant={user.deletedAt ? "default" : "destructive"}
          disabled={busy}
          onClick={() => void toggle()}
        >
          {user.deletedAt ? "Reactivate" : "Deactivate"}
        </Button>
      </div>

      {error && <ErrorNote message={error} />}

      <Panel className="p-5 sm:p-6">
        <h2 className="font-semibold text-brand">Profile</h2>
        {profileEntries.length === 0 ? (
          <p className="mt-3 text-sm text-neutral-500">This user has not completed their profile.</p>
        ) : (
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            {profileEntries.map(([key, value]) => (
              <div key={key} className="min-w-0">
                <dt className="text-xs text-neutral-500">{humanize(key)}</dt>
                <dd className="mt-0.5 break-words text-sm text-brand">{String(value)}</dd>
              </div>
            ))}
          </dl>
        )}
      </Panel>

      {data.jobs.length > 0 && (
        <Panel className="p-5 sm:p-6">
          <h2 className="font-semibold text-brand">Jobs</h2>
          <ul className="mt-2 divide-y divide-black/5">
            {data.jobs.map((j) => (
              <li key={j.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-brand">{j.title}</p>
                  <p className="truncate text-xs text-neutral-500">{j.companyName}</p>
                </div>
                <JobStatusPill status={j.status} />
              </li>
            ))}
          </ul>
        </Panel>
      )}

      {data.applications.length > 0 && (
        <Panel className="p-5 sm:p-6">
          <h2 className="font-semibold text-brand">Applications</h2>
          <ul className="mt-2 divide-y divide-black/5">
            {data.applications.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3 py-3">
                <p className="min-w-0 truncate font-medium text-brand">{a.job?.title}</p>
                <ApplicationStatusPill status={a.status} />
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </div>
  );
}
