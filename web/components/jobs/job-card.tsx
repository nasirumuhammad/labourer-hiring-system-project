import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Job } from "@/types/job";
import { cn } from "cn";

function formatPay(job: Job): string {
  const min = Number(job.minPay).toLocaleString();
  const max = Number(job.maxPay).toLocaleString();
  const suffix = job.paymentType === "hourly" ? "per hour" : "per project";
  return `$${min} – $${max} ${suffix}`;
}

export function JobCard({ job }: { job: Job }) {
  return (
    <Card className="flex-row items-start justify-between gap-4 p-4">
      <div className="flex flex-1 gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-lg font-semibold text-primary">
          {job.companyName.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold">{job.title}</h3>
          <p className="text-sm text-muted-foreground">
            {job.companyName}
            {job.location ? ` · ${job.location}` : ""}
          </p>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {job.description}
          </p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {job.skills.map((skill, index) => (
              <Badge key={index} variant="outline">
                {skill}
              </Badge>
            ))}
            {job.minExperienceYears > 0 && (
              <Badge variant="success">{job.minExperienceYears}+ years</Badge>
            )}
          </div>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <Badge variant={job.paymentType === "fixed" ? "default" : "secondary"}>
          {job.paymentType === "fixed" ? "Fixed" : "Hourly"}
        </Badge>
        <Link
          href={`/jobs/${job.id}`}
          className={cn(buttonVariants({ size: "sm" }))}
        >
          Apply Now →
        </Link>
      </div>
    </Card>
  );
}
