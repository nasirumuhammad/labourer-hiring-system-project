"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "cn";

export default function DashboardPage() {
  const { user, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (user?.role === "employer") {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center gap-4 p-4 text-center">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground">
          Post a job or review who&apos;s applied to your listings.
        </p>
        <div className="flex gap-3">
          <Link href="/employer/jobs/new" className={cn(buttonVariants())}>
            Post a Job
          </Link>
          <Link
            href="/employer/jobs"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            View My Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center gap-4 p-4 text-center">
      <h1 className="text-2xl font-bold">Welcome back</h1>
      <p className="text-muted-foreground">
        Find your next opportunity or check on jobs you&apos;ve applied to.
      </p>
      <div className="flex gap-3">
        <Link href="/jobs" className={cn(buttonVariants())}>
          Browse Jobs
        </Link>
        <Link
          href="/applications"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          My Applications
        </Link>
      </div>
    </div>
  );
}
