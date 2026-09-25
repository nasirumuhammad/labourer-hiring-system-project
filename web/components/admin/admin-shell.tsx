"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "cn";

const links = [
  ["/admin", "Dashboard"],
  ["/admin/users", "Users"],
  ["/admin/labourers", "Labourers"],
  ["/admin/employers", "Employers"],
  ["/admin/administrators", "Administrators"],
  ["/admin/jobs", "Jobs"],
  ["/admin/applications", "Applications"],
  ["/admin/audit-logs", "Audit Logs"],
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useCurrentUser();
  const pathname = usePathname();
  if (!isLoading && user?.role !== "admin") return <div className="mx-auto p-8">You do not have permission to access this area.</div>;
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 gap-6 p-4 md:p-6">
      <aside className="hidden w-52 shrink-0 md:block">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Administration</p>
        <nav className="space-y-1">
          {links.map(([href, label]) => <Link key={href} href={href} className={cn("block rounded-lg px-3 py-2 text-sm", pathname === href || (href !== "/admin" && pathname.startsWith(href)) ? "bg-muted font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>{label}</Link>)}
        </nav>
      </aside>
      <section className="min-w-0 flex-1">{children}</section>
    </div>
  );
}
