"use client";

import { useState } from "react";
import { ApplicationStatus } from "@labour-hiring/enums";
import { AdminHeading, FilterBar, selectClass } from "@/components/admin/admin-ui";
import { EmptyState, ErrorNote, LoadingNote, Panel } from "@/components/layout/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApplicationStatusPill } from "@/components/ui/status-pill";
import { adminApi } from "@/lib/admin";
import { ApiError } from "@/lib/api/api-error";
import type { AdminApplication } from "@/types/admin";

export function AdminApplicationsView({
  applications: initialApplications,
}: {
  applications: AdminApplication[];
}) {
  const [override, setItems] = useState<AdminApplication[] | null>(null);
  const items = override ?? initialApplications;
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ApplicationStatus | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await adminApi.applications({
        search,
        status: status || undefined,
        limit: 50,
      });
      setItems(result?.data?.data ?? []);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (application: AdminApplication) => {
    setError(null);
    try {
      await adminApi.deleteApplication(application.id);
      setConfirmingId(null);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to remove application");
    }
  };

  return (
    <div className="space-y-5">
      <AdminHeading
        title="Applications"
        description="Monitor and moderate submitted applications."
      />

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void load();
        }}
      >
        <FilterBar>
          <Input
            aria-label="Search applicant or job"
            placeholder="Search applicant or job"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            aria-label="Filter by status"
            className={selectClass}
            value={status}
            onChange={(e) => setStatus(e.target.value as ApplicationStatus | "")}
          >
            <option value="">All status</option>
            {Object.values(ApplicationStatus).map((value) => (
              <option key={value} value={value} className="capitalize">
                {value}
              </option>
            ))}
          </select>
          <Button type="submit" className="h-11">
            Search
          </Button>
        </FilterBar>
      </form>

      {error && <ErrorNote message={error} />}
      {loading && <LoadingNote />}
      {!loading && items.length === 0 && (
        <Panel>
          <EmptyState message="No applications found." />
        </Panel>
      )}

      {!loading && (
        <div className="space-y-3">
          {items.map((application) => (
            <Panel key={application.id}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="font-medium text-brand">{application.job?.title}</p>
                  <p className="mt-0.5 break-all text-xs text-neutral-500">
                    {application.applicant?.email} ·{" "}
                    {new Date(application.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <ApplicationStatusPill status={application.status} />
                  {confirmingId === application.id ? (
                    <>
                      <Button size="sm" variant="destructive" onClick={() => void remove(application)}>
                        Yes, remove
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setConfirmingId(null)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" variant="destructive" onClick={() => setConfirmingId(application.id)}>
                      Remove
                    </Button>
                  )}
                </div>
              </div>
              {/* Proposal HTML is sanitized by the API before it is stored. */}
              <div
                className="rich-text mt-4 rounded-xl bg-background p-4"
                dangerouslySetInnerHTML={{ __html: application.proposal }}
              />
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}
