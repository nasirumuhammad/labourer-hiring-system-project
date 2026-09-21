import { JobApplicantsList } from "@/components/jobs/job-application-list";

export default async function JobApplicantsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ title?: string }>;
}) {
  const { id } = await params;
  const { title } = await searchParams;
  return <JobApplicantsList jobId={id} jobTitle={title} />;
}
