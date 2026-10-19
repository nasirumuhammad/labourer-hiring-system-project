"use client";

import Link from "next/link";
import {
  Briefcase,
  Building2,
  CircleCheck,
  Clock,
  FileText,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import { AdminHeading } from "@/components/admin/admin-ui";
import { StatCard } from "@/components/dashboard/stat-card";
import { EmptyState, Panel, PanelHeading } from "@/components/layout/page";
import { ApplicationStatusPill, JobStatusPill } from "@/components/ui/status-pill";
import type { Dashboard } from "@/types/admin";

export default function AdminDashboardPage({ data }: { data: Dashboard | undefined }) {
  if (!data) return <p className="text-sm text-neutral-500">Loading dashboard...</p>;

  return (
    <div className="space-y-6">
      <AdminHeading title="Admin dashboard" description="Platform overview and recent activity." />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard label="Total users" value={data.users.total} note="All accounts" icon={Users} />
        <StatCard label="Clients" value={data.users.clients} note="Looking for work" icon={UserRound} />
        <StatCard label="Employers" value={data.users.employers} note="Hiring" icon={Building2} />
        <StatCard label="Administrators" value={data.users.admins} note="Platform staff" icon={ShieldCheck} />
        <StatCard label="Jobs" value={data.jobs.total} note="All time" icon={Briefcase} />
        <StatCard label="Open jobs" value={data.jobs.open} note="Accepting applicants" icon={CircleCheck} />
        <StatCard label="Applications" value={data.applications.total} note="All time" icon={FileText} />
        <StatCard label="Pending" value={data.applications.pending} note="Awaiting a decision" icon={Clock} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel>
          <PanelHeading title="Recent users" href="/admin/users" />
          {data.recentUsers.length === 0 && <EmptyState message="No users yet." />}
          <ul className="divide-y divide-black/5">
            {data.recentUsers.map((u) => (
              <li key={u.id}>
                <Link
                  href={`/admin/users/${u.id}`}
                  className="block rounded-lg px-1 py-3 hover:bg-background"
                >
                  <p className="truncate font-medium text-brand">
                    {u.profile ? `${u.profile.firstName} ${u.profile.lastName}` : u.email}
                  </p>
                  <p className="truncate text-xs capitalize text-neutral-500">
                    {u.role} · {u.email}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel>
          <PanelHeading title="Recent jobs" href="/admin/jobs" />
          {data.recentJobs.length === 0 && <EmptyState message="No jobs yet." />}
          <ul className="divide-y divide-black/5">
            {data.recentJobs.map((j) => (
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

        <Panel>
          <PanelHeading title="Recent applications" href="/admin/applications" />
          {data.recentApplications.length === 0 && <EmptyState message="No applications yet." />}
          <ul className="divide-y divide-black/5">
            {data.recentApplications.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-brand">{a.job?.title ?? "Job"}</p>
                  <p className="text-xs text-neutral-500">
                    {new Date(a.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <ApplicationStatusPill status={a.status} />
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
