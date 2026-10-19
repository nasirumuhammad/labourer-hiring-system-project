"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PageContainer } from "@/components/layout/page";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "cn";

const links = [
  ["/admin", "Dashboard"],
  ["/admin/users", "Users"],
  ["/admin/clients", "Clients"],
  ["/admin/employers", "Employers"],
  ["/admin/administrators", "Administrators"],
  ["/admin/jobs", "Jobs"],
  ["/admin/applications", "Applications"],
  ["/admin/audit-logs", "Audit logs"],
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useCurrentUser();
  const pathname = usePathname();

  if (!isLoading && user?.role !== "admin") {
    return (
      <PageContainer width="3xl">
        <p className="rounded-2xl border border-black/5 bg-white p-8 text-center text-sm text-neutral-500">
          You do not have permission to access this area.
        </p>
      </PageContainer>
    );
  }

  const isActive = (href: string) =>
    pathname === href || (href !== "/admin" && pathname.startsWith(`${href}/`));

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 px-4 py-6 sm:px-6 md:flex-row md:gap-8 md:py-8 lg:px-8">
      <aside className="md:w-52 md:shrink-0">
        <p className="mb-3 hidden px-3 text-xs font-semibold uppercase tracking-wider text-neutral-400 md:block">
          Administration
        </p>
        <nav
          aria-label="Admin sections"
          className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-col md:overflow-visible md:px-0 md:pb-0"
        >
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-2 text-sm whitespace-nowrap transition-colors md:rounded-xl md:px-3",
                isActive(href)
                  ? "bg-brand-soft font-medium text-brand"
                  : "text-neutral-500 hover:bg-white hover:text-brand",
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <section className="min-w-0 flex-1 space-y-6">{children}</section>
    </div>
  );
}
