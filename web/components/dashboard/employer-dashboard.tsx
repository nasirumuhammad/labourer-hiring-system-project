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
import {
  DotCard,
  EmptyState,
  ErrorNote,
  InitialTile,
  PageContainer,
  PageHeader,
  Panel,
  PanelHeading,
} from "@/components/layout/page";
import { StatCard, type StatDisplay } from "@/components/dashboard/stat-card";
import { ApiError } from "@/lib/api/api-error";
import { jobsApi } from "@/lib/job";
import type { Job } from "@/types/job";

export function EmployerDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [applicantCounts, setApplicantCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await jobsApi.mine(1, 50);
        const list = res?.data?.data ?? [];
        setJobs(list);
        setTotal(res?.data?.total ?? list.length);

        const counts = await Promise.all(
          list.slice(0, 5).map(async (job) => {
            const r = await jobsApi.applicantsForJob(job.id, 1, 1);
            return [job.id, r?.data?.total ?? 0] as const;
          }),
        );
        setApplicantCounts(Object.fromEntries(counts));
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Failed to load dashboard");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const open = jobs.filter((j) => j.status === "open").length;
  const closed = jobs.filter((j) => j.status === "closed").length;

  const stats: StatDisplay[] = [
    { label: "Jobs posted", value: isLoading ? 0 : total, note: "All time", icon: Briefcase },
    { label: "Open", value: isLoading ? 0 : open, note: "Accepting applicants", icon: CircleCheck },
    { label: "Closed", value: isLoading ? 0 : closed, note: "No longer listed", icon: CircleSlash },
  ];

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Welcome back"
        title="Your hiring at a glance"
        action={
          <Link
            href="/employer/jobs/new"
            className="inline-flex items-center gap-1.5 rounded-full bg-cta px-5 py-2.5 text-sm font-medium text-cta-foreground hover:brightness-95"
          >
            Post a job <ArrowUpRight className="size-4" />
          </Link>
        }
      />

      {error && <ErrorNote message={error} />}

      <section aria-label="Your numbers" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {stats.map((s, index) => (
          <div key={s.label} className={index === 2 ? "col-span-2 lg:col-span-1" : undefined}>
            <StatCard {...s} />
          </div>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <PanelHeading title="Recent listings" href="/employer/jobs" hrefLabel="Manage all" />
          {!isLoading && jobs.length === 0 ? (
            <EmptyState message="You haven't posted any jobs yet." />
          ) : (
            <ul>
              {jobs.slice(0, 5).map((job) => (
                <li key={job.id}>
                  <Link
                    href={`/employer/jobs/${job.id}/applicants?title=${encodeURIComponent(job.title)}`}
                    className="flex items-center gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-background sm:gap-4 sm:px-3"
                  >
                    <InitialTile text={job.companyName} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-brand">{job.title}</p>
                      <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-neutral-500">
                        {job.companyName}
                        {job.location && (
                          <>
                            <span aria-hidden>·</span>
                            <MapPin aria-hidden className="size-3 shrink-0" />
                            <span className="truncate">{job.location}</span>
                          </>
                        )}
                      </p>
                    </div>
                    <span
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand-soft px-2.5 py-1 text-xs font-medium text-brand"
                      title="Applicants"
                    >
                      <Users aria-hidden className="size-3.5" />
                      <span aria-label={`${applicantCounts[job.id] ?? 0} applicants`}>
                        {applicantCounts[job.id] ?? "–"}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <DotCard>
          <p className="text-sm text-white/70">Before you publish</p>
          <p className="mt-2 text-xl font-semibold">Check the pay twice</p>
          <p className="mt-4 text-sm leading-relaxed text-white/80">
            Once someone applies, the pay on that job is locked. You can still
            edit the description, location and skills, or delete the listing.
          </p>
          <Link
            href="/employer/jobs"
            className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-cta px-4 py-2 text-sm font-medium text-cta-foreground hover:brightness-95"
          >
            My jobs <ArrowUpRight className="size-4" />
          </Link>
        </DotCard>
      </div>
    </PageContainer>
  );
}
