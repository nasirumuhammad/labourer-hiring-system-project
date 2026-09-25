"use client";
import { useEffect, useState } from "react";
import { adminApi, Dashboard } from "@/lib/api/admin";
import Link from "next/link";

const Stat = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-xl border p-4">
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="mt-2 text-2xl font-bold">{value}</p>
  </div>
);
export default function AdminDashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);
  useEffect(() => {
    adminApi.dashboard().then(setData);
  }, []);
  if (!data) return <p>Loading dashboard...</p>;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Platform overview and recent activity.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total Users" value={data.users.total} />
        <Stat label="Labourers" value={data.users.labourers} />
        <Stat label="Employers" value={data.users.employers} />
        <Stat label="Administrators" value={data.users.admins} />
        <Stat label="Jobs" value={data.jobs.total} />
        <Stat label="Open Jobs" value={data.jobs.open} />
        <Stat label="Applications" value={data.applications.total} />
        <Stat label="Pending Applications" value={data.applications.pending} />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border p-4">
          <h2 className="font-semibold">Recent Users</h2>
          {data.recentUsers.map((u) => (
            <Link href={`/admin/users/${u.id}`} key={u.id}>
              <div className="border-b py-3 last:border-0">
                <p className="font-medium">
                  {u.profile
                    ? `${u.profile.firstName} ${u.profile.lastName}`
                    : u.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  {u.role} · {u.email}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <div className="rounded-xl border p-4">
          <h2 className="font-semibold">Recent Jobs</h2>
          {data.recentJobs.map((j) => (
            <div key={j.id} className="border-b py-3 last:border-0">
              <p className="font-medium">{j.title}</p>
              <p className="text-xs text-muted-foreground">
                {j.companyName} · {j.status}
              </p>
            </div>
          ))}
        </div>
        <div className="rounded-xl border p-4">
          <h2 className="font-semibold">Recent Applications</h2>
          {data.recentApplications.map((a) => (
            <div key={a.id} className="border-b py-3 last:border-0">
              <p className="font-medium">{a.job?.title ?? "Job"}</p>
              <p className="text-xs text-muted-foreground">
                {a.status} · {new Date(a.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
