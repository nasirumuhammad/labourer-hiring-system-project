import type { Metadata } from "next";
import { cookies } from "next/headers";
import { UserRole } from "@labour-hiring/enums";
import { ClientDashboard } from "@/components/dashboard/client-dashboard";
import { EmployerDashboard } from "@/components/dashboard/employer-dashboard";
import { ACCESS_TOKEN_COOKIE } from "@/lib/cookie-config";
import { verifyAccessToken } from "@/lib/verify-token";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Your JobLink overview: applications, recommended jobs and listings at a glance.",
};

async function getRole(): Promise<UserRole | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  if (!token) return null;
  const payload = await verifyAccessToken(token);
  return payload?.role ?? null;
}

export default async function DashboardPage() {
  const role = await getRole();
  return role === UserRole.EMPLOYER ? <EmployerDashboard /> : <ClientDashboard />;
}
