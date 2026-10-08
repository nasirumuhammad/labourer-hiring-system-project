"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Briefcase,
  CircleCheck,
  CircleSlash,
  MapPin,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ApiError } from "@/lib/api/api-error";
import { jobsApi } from "@/lib/job";
import type { Job } from "@/types/job";

interface StatDisplay {
  label: string;
  value: number;
  note: string;
  icon: LucideIcon;
}

function StatCard({ label, value, note, icon: Icon }: StatDisplay) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-neutral-500">{label}</span>
        <span className="grid size-8 place-items-center rounded-full bg-[#E6F4EC] text-[#0B3D2E]">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-[#0B3D2E]">
        {value}
      </p>
      <p className="mt-1 text-xs text-neutral-400">{note}</p>
    </div>
  );
}

export default function EmployerDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [applicantCounts, setApplicantCounts] = useState<
    Record<string, number>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await jobsApi.mine(1, 50);
        const list = res?.data?.data ?? [];
        setJobs(list);
        setTotal(res?.data?.total ?? list.length);

        const recent = list.slice(0, 5);
        const counts = await Promise.all(
          recent.map(async (job) => {
            const r = await jobsApi.applicantsForJob(job.id, 1, 1);
            return [job.id, r?.data?.total ?? 0] as const;
          }),
        );
        setApplicantCounts(Object.fromEntries(counts));
      } catch (err) {
        setError(
          err instanceof ApiError ? err.message : "Failed to load dashboard",
        );
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const open = jobs.filter((j) => j.status === "open").length;
  const closed = jobs.filter((j) => j.status === "closed").length;

  const stats: StatDisplay[] = [
    { label: "Jobs posted", value: total, note: "All time", icon: Briefcase },
    {
      label: "Open",
      value: open,
      note: "Accepting applicants",
      icon: CircleCheck,
    },
    {
      label: "Closed",
      value: closed,
      note: "No longer listed",
      icon: CircleSlash,
    },
  ];

  return (
    <main className="min-h-screen bg-[#F5F7F5] px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm text-neutral-500">Welcome back</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#0B3D2E]">
              Your hiring at a glance
            </h1>
          </div>
          <Link
            href="/employer/jobs/new"
            className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#1DBF73] px-5 py-2.5 text-sm font-medium text-[#062A1F] hover:brightness-95"
          >
            Post a job <ArrowUpRight className="size-4" />
          </Link>
        </header>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} value={isLoading ? 0 : s.value} />
          ))}
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-2xl border border-black/5 bg-white p-4 lg:col-span-2">
            <div className="flex items-center justify-between px-3 pb-2 pt-2">
              <h2 className="font-semibold text-[#0B3D2E]">Recent listings</h2>
              <Link
                href="/employer/jobs"
                className="text-sm text-[#12915A] hover:underline"
              >
                Manage all
              </Link>
            </div>
            {!isLoading && jobs.length === 0 ? (
              <p className="px-3 py-6 text-sm text-neutral-500">
                You haven&apos;t posted any jobs yet.
              </p>
            ) : (
              <ul>
                {jobs.slice(0, 5).map((job) => (
                  <li key={job.id}>
                    <Link
                      href={`/employer/jobs/${job.id}/applicants?title=${encodeURIComponent(job.title)}`}
                      className="flex items-center gap-4 rounded-xl px-3 py-3 transition-colors hover:bg-[#F5F7F5]"
                    >
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#E9E4FA] text-sm font-semibold text-[#4B3A8F]">
                        {job.companyName.charAt(0).toUpperCase()}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-[#0B3D2E]">
                          {job.title}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-neutral-500">
                          {job.companyName}
                          {job.location && (
                            <>
                              <span aria-hidden>·</span>
                              <MapPin className="size-3" /> {job.location}
                            </>
                          )}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E6F4EC] px-2.5 py-1 text-xs font-medium text-[#0B3D2E]">
                        <Users className="size-3.5" />
                        {applicantCounts[job.id] ?? "–"}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="relative overflow-hidden rounded-2xl bg-[#0B3D2E] p-6 text-white">
            <div
              aria-hidden
              className="absolute inset-0 opacity-20 [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:14px_14px]"
            />
            <div className="relative">
              <p className="text-sm text-white/70">Before you publish</p>
              <p className="mt-2 text-xl font-semibold">Check the pay twice</p>
              <p className="mt-4 text-sm leading-relaxed text-white/80">
                Once someone applies, the pay on that job is locked. You can
                still edit the description, location and skills, or delete the
                listing.
              </p>
              <Link
                href="/employer/jobs"
                className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#1DBF73] px-4 py-2 text-sm font-medium text-[#062A1F] hover:brightness-95"
              >
                My jobs <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
