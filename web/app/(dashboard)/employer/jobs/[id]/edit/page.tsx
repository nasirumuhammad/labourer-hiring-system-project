import type { Metadata } from "next";
import { RequireRole } from "@/components/auth/require-role";
import { EditJobView } from "@/components/jobs/edit-job-view";

export const metadata: Metadata = {
  title: "Edit job",
  description: "Update the details of one of your job listings.",
};

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <RequireRole role="employer">
      <EditJobView jobId={id} />
    </RequireRole>
  );
}
