import type { Metadata } from "next";
import Link from "next/link";
import { Brand } from "@/components/layout/brand";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you are looking for does not exist.",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <Brand />
      <div>
        <p className="text-sm text-neutral-500">Error 404</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-brand">
          We couldn&apos;t find that page
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          It may have moved, or the link might be wrong.
        </p>
      </div>
      <Link
        href="/"
        className="inline-flex h-10 items-center rounded-full bg-cta px-5 text-sm font-medium text-cta-foreground hover:brightness-95"
      >
        Back to home
      </Link>
    </main>
  );
}
