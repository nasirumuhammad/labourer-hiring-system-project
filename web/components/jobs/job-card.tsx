import Link from "next/link";
import { MapPin } from "lucide-react";
import { InitialTile } from "@/components/layout/page";
import { Badge } from "@/components/ui/badge";
import { formatPay } from "@/lib/format-pay";
import type { Job } from "@/types/job";

export function JobCard({ job }: { job: Job }) {
  return (
    <article className="rounded-2xl border border-black/5 bg-white p-4 transition-colors hover:border-black/10 sm:p-5">
      <div className="flex items-start gap-3 sm:gap-4">
        <InitialTile text={job.companyName} className="size-12" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
            <h3 className="min-w-0 font-semibold text-brand">
              <Link href={`/jobs/${job.id}`} className="hover:underline">
                {job.title}
              </Link>
            </h3>
            <Badge variant={job.paymentType === "fixed" ? "default" : "secondary"}>
              {job.paymentType === "fixed" ? "Fixed" : "Hourly"}
            </Badge>
          </div>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-neutral-500">
            {job.companyName}
            {job.location && (
              <>
                <span aria-hidden>·</span>
                <MapPin aria-hidden className="size-3 shrink-0" />
                <span className="truncate">{job.location}</span>
              </>
            )}
          </p>
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-neutral-600">
            {job.description}
          </p>
          {(job.skills.length > 0 || job.minExperienceYears > 0) && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {job.skills.slice(0, 6).map((skill) => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
              {job.minExperienceYears > 0 && (
                <Badge variant="success">{job.minExperienceYears}+ years</Badge>
              )}
            </div>
          )}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-brand">{formatPay(job)}</p>
            <Link
              href={`/jobs/${job.id}`}
              className="inline-flex h-9 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:brightness-95"
            >
              View &amp; apply
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
