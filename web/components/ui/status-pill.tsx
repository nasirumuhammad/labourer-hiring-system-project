import type { Application, Job } from "@/types/job";
import { cn } from "cn";

type Style = { label: string; style: string };

const APPLICATION: Record<Application["status"], Style> = {
  accepted: { label: "Shortlisted", style: "bg-brand-soft text-brand" },
  pending: { label: "Pending", style: "bg-violet-soft text-violet-ink" },
  rejected: { label: "Not selected", style: "bg-neutral-100 text-neutral-500" },
  withdrawn: { label: "Withdrawn", style: "bg-neutral-100 text-neutral-500" },
};

const JOB: Record<Job["status"], Style> = {
  open: { label: "Open", style: "bg-brand-soft text-brand" },
  closed: { label: "Closed", style: "bg-neutral-100 text-neutral-500" },
  draft: { label: "Draft", style: "bg-violet-soft text-violet-ink" },
};

function Pill({ label, style }: Style) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium",
        style,
      )}
    >
      {label}
    </span>
  );
}

export function ApplicationStatusPill({ status }: { status: Application["status"] }) {
  return <Pill {...APPLICATION[status]} />;
}

export function JobStatusPill({ status }: { status: Job["status"] }) {
  return <Pill {...JOB[status]} />;
}
