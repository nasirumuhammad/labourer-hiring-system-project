import type { Metadata } from "next";
import { cookies } from "next/headers";
import { UserRole } from "@labour-hiring/enums";
import { AppHeader, type NavLink } from "@/components/layout/app-header";
import { ACCESS_TOKEN_COOKIE } from "@/lib/cookie-config";
import { verifyAccessToken } from "@/lib/verify-token";

// Everything behind sign-in stays out of search results.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const CLIENT_LINKS: NavLink[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/jobs", label: "Browse jobs" },
  { href: "/applications", label: "My applications" },
  { href: "/profile", label: "Profile" },
];

const EMPLOYER_LINKS: NavLink[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/employer/jobs", label: "My jobs" },
  { href: "/employer/jobs/new", label: "Post a job" },
  { href: "/profile", label: "Profile" },
];

const ADMIN_LINKS: NavLink[] = [{ href: "/admin", label: "Admin" }];

async function getRole(): Promise<UserRole | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  if (!token) return null;
  const payload = await verifyAccessToken(token);
  return payload?.role ?? null;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role = await getRole();
  const links =
    role === UserRole.ADMIN
      ? ADMIN_LINKS
      : role === UserRole.EMPLOYER
        ? EMPLOYER_LINKS
        : CLIENT_LINKS;

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader links={links} homeHref={role === UserRole.ADMIN ? "/admin" : "/dashboard"} />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
