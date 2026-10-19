import type { Metadata } from "next";
import { RequireRole } from "@/components/auth/require-role";
import { JobApplicantsList } from "@/components/jobs/job-application-list";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ title?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { title } = await searchParams;
  return {
    title: title ? `Applicants for ${title}` : "Applicants",
    description: "Review proposals and accept or reject applicants for this job.",
  };
}

export default async function JobApplicantsPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { title } = await searchParams;
  return (
    <RequireRole role="employer">
      <JobApplicantsList jobId={id} jobTitle={title} />
    </RequireRole>
  );
}
