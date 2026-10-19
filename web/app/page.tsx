import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { ArrowUpRight, MapPin, Search } from "lucide-react";
import { Brand } from "@/components/layout/brand";
import { DotCard, InitialTile } from "@/components/layout/page";
import { ACCESS_TOKEN_COOKIE } from "@/lib/cookie-config";
import { verifyAccessToken } from "@/lib/verify-token";

export const metadata: Metadata = {
  title: "Hire skilled trades. Find honest work.",
  description:
    "Post a job or apply in one tap. JobLink lists day jobs and short contracts for plumbers, electricians, painters, drivers and more across Nigeria.",
  alternates: { canonical: "/" },
};

const TRADES = [
  "Plumbing",
  "Electrical",
  "Painting",
  "Tiling",
  "Bricklaying",
  "Welding",
  "Carpentry",
  "Driving",
  "Loading",
];

const CLIENT_STEPS = [
  "Create an account, then add your phone number, BVN or NIN and bank details to your profile.",
  "Search open jobs by trade or location and send a short proposal.",
  "Watch your application move from pending to shortlisted.",
];

const EMPLOYER_STEPS = [
  "Create an account and post a job with a pay range and the skills you need.",
  "Review who applied, then accept or reject each applicant.",
  "Edit or take down a listing any time. Pay is fixed once someone applies.",
];

const EXAMPLES = [
  { title: "Bathroom tiling", company: "Adebayo Builders", location: "Lagos", pay: "₦45,000 – ₦60,000" },
  { title: "Site electrician", company: "Northgate Estates", location: "Abuja", pay: "₦6,000 – ₦8,000 / day" },
  { title: "Pickup driver", company: "Kano Fresh Foods", location: "Kano", pay: "₦5,000 – ₦7,000 / day" },
];

async function isSignedIn(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  if (!token) return false;
  return !!(await verifyAccessToken(token));
}

function Steps({ title, steps }: { title: string; steps: string[] }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 sm:p-6">
      <h2 className="font-semibold text-brand">{title}</h2>
      <ol className="mt-4 space-y-4">
        {steps.map((step, index) => (
          <li key={step} className="flex gap-3">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-soft text-xs font-semibold text-brand">
              {index + 1}
            </span>
            <p className="text-sm leading-relaxed text-neutral-600">{step}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default async function Home() {
  const signedIn = await isSignedIn();

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Brand />
        <nav aria-label="Account" className="flex items-center gap-1 text-sm sm:gap-2">
          {signedIn ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-full bg-cta px-4 py-2 font-medium text-cta-foreground hover:brightness-95"
            >
              Dashboard <ArrowUpRight className="size-4" />
            </Link>
          ) : (
            <>
              <Link href="/signin" className="px-3 py-2 text-neutral-600 hover:text-brand">
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-cta px-4 py-2 font-medium text-cta-foreground hover:brightness-95"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl space-y-12 px-4 pb-16 pt-6 sm:space-y-16 sm:px-6 sm:pb-20 sm:pt-10 lg:px-8">
        <section className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-brand sm:text-4xl lg:text-5xl">
              Hire a plumber by Friday. Find a job by Monday.
            </h1>
            <p className="mt-5 max-w-lg leading-relaxed text-neutral-600">
              JobLink lists day jobs and short contracts for tradespeople across
              Nigeria. Employers post the work, clients apply, and payout
              details are already on file.
            </p>
            <form
              action="/jobs"
              role="search"
              className="mt-8 flex max-w-md items-center gap-2 rounded-full border border-black/5 bg-white p-1.5 pl-4"
            >
              <Search aria-hidden className="size-4 shrink-0 text-neutral-400" />
              <input
                name="search"
                aria-label="Search trade or location"
                placeholder="Search trade or location"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-400"
              />
              <button
                type="submit"
                className="rounded-full bg-cta px-5 py-2 text-sm font-medium text-cta-foreground hover:brightness-95"
              >
                Search
              </button>
            </form>
            <div className="mt-5 flex flex-wrap gap-2">
              {TRADES.map((trade) => (
                <Link
                  key={trade}
                  href={`/jobs?search=${encodeURIComponent(trade)}`}
                  className="rounded-full border border-black/5 bg-white px-3 py-1.5 text-xs text-neutral-600 transition-colors hover:bg-brand-soft hover:text-brand"
                >
                  {trade}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-black/5 bg-white p-3 sm:p-4">
            <p className="px-3 pb-2 pt-2 text-xs text-neutral-400">Example listings</p>
            <ul>
              {EXAMPLES.map((job) => (
                <li
                  key={job.title}
                  className="flex items-center gap-4 rounded-xl px-3 py-3 hover:bg-background"
                >
                  <InitialTile text={job.company} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-brand">{job.title}</p>
                    <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-neutral-500">
                      {job.company} <span aria-hidden>·</span>
                      <MapPin aria-hidden className="size-3" /> {job.location}
                    </p>
                    <p className="mt-1 text-xs text-neutral-600 sm:hidden">{job.pay}</p>
                  </div>
                  <span className="hidden text-sm text-neutral-600 sm:block">{job.pay}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-label="How it works" className="grid gap-4 sm:gap-6 md:grid-cols-2">
          <Steps title="If you’re looking for work" steps={CLIENT_STEPS} />
          <Steps title="If you’re hiring" steps={EMPLOYER_STEPS} />
        </section>

        <DotCard className="p-6 sm:p-10">
          <div className="max-w-xl">
            <h2 className="text-xl font-semibold sm:text-2xl">
              Set up once. Your details stay on file.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              Your name, address, BVN or NIN and bank account live on your
              profile, so applying to a job never means filling in a payout form
              again.
            </p>
            {!signedIn && (
              <Link
                href="/signup"
                className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-cta px-5 py-2.5 text-sm font-medium text-cta-foreground hover:brightness-95"
              >
                Create an account <ArrowUpRight className="size-4" />
              </Link>
            )}
          </div>
        </DotCard>
      </main>

      <footer className="border-t border-black/5">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 text-xs text-neutral-500 sm:px-6 lg:px-8">
          <span>© {new Date().getFullYear()} JobLink</span>
          <Link href="/jobs" className="hover:text-brand">
            Browse jobs
          </Link>
        </div>
      </footer>
    </div>
  );
}
