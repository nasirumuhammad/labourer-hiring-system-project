import type { Metadata } from "next";
import { RequireRole } from "@/components/auth/require-role";
import { PageContainer, PageHeader, Panel } from "@/components/layout/page";
import { PostJobForm } from "@/components/jobs/post-job-form";

export const metadata: Metadata = {
  title: "Post a job",
  description: "Create a new listing with pay, skills and location. It goes live as soon as you post it.",
};

export default function NewJobPage() {
  return (
    <RequireRole role="employer">
      <PageContainer width="3xl">
        <PageHeader
          eyebrow="Employer"
          title="Post a job"
          description="Fill in the details below. Your listing goes live as soon as you post it. Pay is locked once someone applies."
        />
        <Panel className="p-5 sm:p-6">
          <PostJobForm />
        </Panel>
      </PageContainer>
    </RequireRole>
  );
}
