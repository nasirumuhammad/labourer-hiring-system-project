import type { Metadata } from "next";
import { RequireRole } from "@/components/auth/require-role";
import { EmployerJobsView } from "@/components/jobs/employer-jobs-view";

export const metadata: Metadata = {
  title: "My jobs",
  description: "Manage the jobs you have posted: review applicants, edit listings or delete them.",
};

export default function EmployerJobsPage() {
  return (
    <RequireRole role="employer">
      <EmployerJobsView />
    </RequireRole>
  );
}
