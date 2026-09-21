"use client";

import Link from "next/link";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useCurrentUser();
  const isEmployer = user?.role === "employer";

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 font-semibold"
            >
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                J
              </span>
              JobLink
            </Link>
            <nav className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
              <Link href="/dashboard" className="hover:text-foreground">
                Home
              </Link>
              {!isLoading &&
                (isEmployer ? (
                  <>
                    <Link
                      href="/employer/jobs"
                      className="hover:text-foreground"
                    >
                      My Jobs
                    </Link>
                    <Link
                      href="/employer/jobs/new"
                      className="hover:text-foreground"
                    >
                      Post a Job
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/jobs" className="hover:text-foreground">
                      Jobs
                    </Link>
                    <Link
                      href="/applications"
                      className="hover:text-foreground"
                    >
                      My Applications
                    </Link>
                  </>
                ))}
            </nav>
          </div>
          <SignOutButton />
        </div>
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
