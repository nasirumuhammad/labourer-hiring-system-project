import { cookies } from "next/headers";
import Link from "next/link";
import { ArrowUpRight, MapPin, Search } from "lucide-react";
import { ACCESS_TOKEN_COOKIE } from "@/lib/cookie-config";
import { verifyAccessToken } from "@/lib/verify-token";

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

const LABOURER_STEPS = [
  "Create an account with your phone number, BVN or NIN and bank details.",
  "Search open jobs by trade or location and apply with one tap.",
  "Watch your application move from pending to shortlisted.",
];

const EMPLOYER_STEPS = [
  "Create an account and post a job with a pay range and the skills you need.",
  "Review who applied, then accept or reject each applicant.",
  "Edit or take down a listing any time. Pay is fixed once someone applies.",
];

async function isSignedIn(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  if (!token) return false;
  return !!(await verifyAccessToken(token));
}

function Steps({ title, steps }: { title: string; steps: string[] }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-6">
      <h3 className="font-semibold text-[#0B3D2E]">{title}</h3>
      <ol className="mt-4 space-y-4">
        {steps.map((step, index) => (
          <li key={step} className="flex gap-3">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#E6F4EC] text-xs font-semibold text-[#0B3D2E]">
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
    <div className="min-h-screen bg-[#F5F7F5]">
      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-[#0B3D2E]"
        >
          <span className="grid size-8 place-items-center rounded-lg bg-[#0B3D2E] text-sm text-white">
            J
          </span>
          JobLink
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          {signedIn ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#1DBF73] px-4 py-2 font-medium text-[#062A1F] hover:brightness-95"
            >
              Dashboard <ArrowUpRight className="size-4" />
            </Link>
          ) : (
            <>
              <Link
                href="/signin"
                className="px-3 py-2 text-neutral-600 hover:text-[#0B3D2E]"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-[#1DBF73] px-4 py-2 font-medium text-[#062A1F] hover:brightness-95"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl space-y-16 px-4 pb-20 pt-10 sm:px-8">
        <section className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-[#0B3D2E] sm:text-5xl">
              Hire a plumber by Friday. Find a job by Monday.
            </h1>
            <p className="mt-5 max-w-lg leading-relaxed text-neutral-600">
              JobLink lists day jobs and short contracts for tradespeople and
              labourers across Nigeria. Employers post the work, labourers
              apply, and payout details are already on file.
            </p>
            <form
              action="/jobs"
              className="mt-8 flex max-w-md items-center gap-2 rounded-full border border-black/5 bg-white p-1.5 pl-4"
            >
              <Search className="size-4 text-neutral-400" />
              <input
                name="search"
                placeholder="Search trade or location"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-400"
              />
              <button
                type="submit"
                className="rounded-full bg-[#1DBF73] px-5 py-2 text-sm font-medium text-[#062A1F]"
              >
                Search
              </button>
            </form>
            <div className="mt-5 flex flex-wrap gap-2">
              {TRADES.map((trade) => (
                <Link
                  key={trade}
                  href={`/jobs?search=${encodeURIComponent(trade)}`}
                  className="rounded-full border border-black/5 bg-white px-3 py-1.5 text-xs text-neutral-600 transition-colors hover:bg-[#E6F4EC] hover:text-[#0B3D2E]"
                >
                  {trade}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-black/5 bg-white p-4">
            <p className="px-3 pb-2 pt-2 text-xs text-neutral-400">
              What a listing looks like
            </p>
            <ul>
              {[
                {
                  t: "Bathroom tiling",
                  c: "Adebayo Builders",
                  l: "Lagos",
                  p: "₦45,000 – ₦60,000",
                },
                {
                  t: "Site electrician",
                  c: "Northgate Estates",
                  l: "Abuja",
                  p: "₦6,000 – ₦8,000 / day",
                },
                {
                  t: "Pickup driver",
                  c: "Kano Fresh Foods",
                  l: "Kano",
                  p: "₦5,000 – ₦7,000 / day",
                },
              ].map((job) => (
                <li
                  key={job.t}
                  className="flex items-center gap-4 rounded-xl px-3 py-3 hover:bg-[#F5F7F5]"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#E9E4FA] text-sm font-semibold text-[#4B3A8F]">
                    {job.c.charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-[#0B3D2E]">
                      {job.t}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-neutral-500">
                      {job.c} <span aria-hidden>·</span>
                      <MapPin className="size-3" /> {job.l}
                    </p>
                  </div>
                  <span className="hidden text-sm text-neutral-600 sm:block">
                    {job.p}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <Steps title="If you’re looking for work" steps={LABOURER_STEPS} />
          <Steps title="If you’re hiring" steps={EMPLOYER_STEPS} />
        </section>

        <section className="relative overflow-hidden rounded-2xl bg-[#0B3D2E] p-8 text-white sm:p-10">
          <div
            aria-hidden
            className="absolute inset-0 opacity-20 [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:14px_14px]"
          />
          <div className="relative max-w-xl">
            <h2 className="text-2xl font-semibold">
              Sign up once. Your details stay on file.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              We collect your name, address, BVN or NIN and bank account when
              you register, so applying to a job never means filling in a payout
              form again.
            </p>
            {!signedIn && (
              <Link
                href="/signup"
                className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-[#1DBF73] px-5 py-2.5 text-sm font-medium text-[#062A1F] hover:brightness-95"
              >
                Create an account <ArrowUpRight className="size-4" />
              </Link>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-black/5">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 text-xs text-neutral-500 sm:px-8">
          <span>© {new Date().getFullYear()} JobLink</span>
          <Link href="/jobs" className="hover:text-[#0B3D2E]">
            Browse jobs
          </Link>
        </div>
      </footer>
    </div>
  );
}
