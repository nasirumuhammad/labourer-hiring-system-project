import Link from "next/link";
import {
  ArrowUpRight,
  Bookmark,
  Briefcase,
  Clock,
  MapPin,
  Search,
  Star,
} from "lucide-react";
import {
  DotCard,
  EmptyState,
  ErrorNote,
  InitialTile,
  PageContainer,
  Panel,
  PanelHeading,
} from "@/components/layout/page";
import { StatCard, type StatDisplay } from "@/components/dashboard/stat-card";
import { ApplicationStatusPill } from "@/components/ui/status-pill";
import { SaveJobButton } from "@/components/jobs/saved-job-button";
import { dashboardApi } from "@/lib/job";
import { formatPay } from "@/lib/format-pay";
import type { Application, DashboardSummary, Job } from "@/types/job";

function buildStats(stats: DashboardSummary["stats"]): StatDisplay[] {
  return [
    { label: "Applications", value: stats.total, note: "All time", icon: Briefcase },
    { label: "Shortlisted", value: stats.shortlisted, note: "Employer accepted", icon: Star },
    { label: "Pending", value: stats.pending, note: "Awaiting response", icon: Clock },
    { label: "Saved jobs", value: stats.saved, note: "Bookmarked", icon: Bookmark },
  ];
}

function RecommendedJobRow({ job }: { job: Job & { isSaved: boolean } }) {
  return (
    <li className="flex items-center gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-background sm:gap-4 sm:px-3">
      <Link href={`/jobs/${job.id}`} className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
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
          <p className="mt-1 text-xs text-neutral-600 md:hidden">{formatPay(job)}</p>
        </div>
      </Link>
      <span className="hidden text-sm text-neutral-600 md:block">{formatPay(job)}</span>
      <SaveJobButton jobId={job.id} initiallySaved={job.isSaved} />
    </li>
  );
}

function ApplicationRow({ application }: { application: Application }) {
  return (
    <li className="flex items-center justify-between gap-3 py-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-brand">
          {application.job?.title ?? "Job"}
        </p>
        <p className="truncate text-xs text-neutral-500">
          {application.job?.companyName ?? "—"} ·{" "}
          {new Date(application.createdAt).toLocaleDateString()}
        </p>
      </div>
      <ApplicationStatusPill status={application.status} />
    </li>
  );
}

function ProfileStrengthCard({ completion }: { completion: number }) {
  const isComplete = completion >= 100;
  return (
    <DotCard>
      <p className="text-sm text-white/70">Profile strength</p>
      <p className="mt-2 text-4xl font-semibold">{completion}%</p>
      <div
        role="progressbar"
        aria-valuenow={completion}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Profile strength"
        className="mt-4 h-1.5 rounded-full bg-white/15"
      >
        <div className="h-full rounded-full bg-cta" style={{ width: `${completion}%` }} />
      </div>
      <p className="mt-4 text-sm leading-relaxed text-white/80">
        {isComplete
          ? "Your profile is complete. Keep it up to date to stay competitive."
          : "Complete your profile so employers can find and shortlist you."}
      </p>
      {!isComplete && (
        <Link
          href="/profile"
          className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-cta px-4 py-2 text-sm font-medium text-cta-foreground hover:brightness-95"
        >
          Complete profile <ArrowUpRight className="size-4" />
        </Link>
      )}
    </DotCard>
  );
}

export async function ClientDashboard() {
  const response = await dashboardApi.summary().catch(() => undefined);
  const summary = response?.data;

  if (!summary) {
    return (
      <PageContainer width="3xl">
        <ErrorNote message="We couldn't load your dashboard right now. Please refresh the page." />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm text-neutral-500">Welcome back</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-brand sm:text-3xl">
            Find your next job
          </h1>
        </div>
        <form
          action="/jobs"
          role="search"
          className="flex w-full max-w-md items-center gap-2 rounded-full border border-black/5 bg-white p-1.5 pl-4"
        >
          <Search aria-hidden className="size-4 shrink-0 text-neutral-400" />
          <input
            name="search"
            aria-label="Search trade or location"
            placeholder="Search trade or location"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-400"
          />
          <button
            type="submit"
            className="rounded-full bg-cta px-5 py-2 text-sm font-medium text-cta-foreground hover:brightness-95"
          >
            Search
          </button>
        </form>
      </header>

      <section aria-label="Your numbers" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {buildStats(summary.stats).map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <PanelHeading title="Recommended for you" href="/jobs" />
          {summary.recommendedJobs.length > 0 ? (
            <ul>
              {summary.recommendedJobs.map((job) => (
                <RecommendedJobRow key={job.id} job={job} />
              ))}
            </ul>
          ) : (
            <EmptyState message="No open jobs match you right now. Check back soon." />
          )}
        </Panel>

        <div className="space-y-6">
          <ProfileStrengthCard completion={summary.profileCompletion} />
          <Panel>
            <PanelHeading title="My applications" href="/applications" hrefLabel="See all" />
            {summary.recentApplications.length > 0 ? (
              <ul className="divide-y divide-black/5">
                {summary.recentApplications.map((application) => (
                  <ApplicationRow key={application.id} application={application} />
                ))}
              </ul>
            ) : (
              <EmptyState message="You haven't applied to any jobs yet." />
            )}
          </Panel>
        </div>
      </div>
    </PageContainer>
  );
}
