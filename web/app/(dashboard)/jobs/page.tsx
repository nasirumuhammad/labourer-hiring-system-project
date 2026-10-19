import type { Metadata } from "next";
import { JobsBrowser } from "@/components/jobs/job-browser";

export const metadata: Metadata = {
  title: "Browse jobs",
  description:
    "Search open day jobs and short contracts by trade, skill, pay type or location, then apply with a short proposal.",
};

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  return <JobsBrowser initialSearch={search ?? ""} />;
}
