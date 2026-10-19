import type { Metadata } from "next";
import { PageContainer, PageHeader } from "@/components/layout/page";
import { ProfileForm } from "@/components/profile/profile-form";

export const metadata: Metadata = {
  title: "Profile",
  description: "Keep your contact, identity and payout details up to date.",
};

export default function ProfilePage() {
  return (
    <PageContainer width="3xl">
      <PageHeader
        eyebrow="Account"
        title="Your profile"
        description="Employers see your name and skills. Identity and bank details are kept private."
      />
      <ProfileForm />
    </PageContainer>
  );
}
