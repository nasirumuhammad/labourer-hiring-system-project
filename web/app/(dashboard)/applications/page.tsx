import type { Metadata } from "next";
import { ApplicationsView } from "@/components/jobs/applications-view";

export const metadata: Metadata = {
  title: "My applications",
  description: "Track every job you have applied for and see employer decisions as they happen.",
};

export default function ApplicationsPage() {
  return <ApplicationsView />;
}
