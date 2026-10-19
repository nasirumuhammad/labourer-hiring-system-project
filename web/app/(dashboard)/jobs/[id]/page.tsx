import type { Metadata } from "next";
import { JobDetail } from "@/components/jobs/job-detail";
import { jobsApi } from "@/lib/job";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const job = (await jobsApi.getById(id))?.data;
    if (job) {
      return {
        title: `${job.title} at ${job.companyName}`,
        description: job.description.slice(0, 155),
      };
    }
  } catch {
    // fall through to the generic title
  }
  return {
    title: "Job details",
    description: "View the pay, requirements and description for this job.",
  };
}

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params;
  return <JobDetail jobId={id} />;
}
