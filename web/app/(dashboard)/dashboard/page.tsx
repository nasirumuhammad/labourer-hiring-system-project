import {
  ArrowUpRight,
  Bookmark,
  Briefcase,
  CalendarCheck,
  Eye,
  MapPin,
  Search,
  Star,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Palette from the reference (map these to your theme tokens if you have them):
 * brand #1DBF73 | ink #0B3D2E | lilac #E9E4FA | mint #E6F4EC | canvas #F5F7F5
 * All data below is static — swap for your API calls (server-side fetch).
 */

const APPLICATION_STATUS = {
  SHORTLISTED: { label: "Shortlisted", style: "bg-[#E6F4EC] text-[#0B3D2E]" },
  PENDING: { label: "Pending", style: "bg-[#E9E4FA] text-[#4B3A8F]" },
  REJECTED: { label: "Not selected", style: "bg-neutral-100 text-neutral-500" },
} as const;

type StatusKey = keyof typeof APPLICATION_STATUS;

interface Stat {
  label: string;
  value: string;
  note: string;
  icon: LucideIcon;
}

const STATS: Stat[] = [
  { label: "Applications", value: "12", note: "3 this week", icon: Briefcase },
  { label: "Shortlisted", value: "4", note: "Up from 2", icon: Star },
  {
    label: "Interviews",
    value: "2",
    note: "Next: Thursday",
    icon: CalendarCheck,
  },
  { label: "Profile views", value: "38", note: "Last 30 days", icon: Eye },
];

const RECOMMENDED_JOBS = [
  {
    title: "Site Electrician",
    company: "Brightline Construction",
    location: "Gwarinpa, Abuja",
    pay: "₦15,000 / day",
  },
  {
    title: "Tile Layer",
    company: "Arewa Interiors",
    location: "Wuse 2, Abuja",
    pay: "₦12,000 / day",
  },
  {
    title: "Welder (Steel Fabrication)",
    company: "Kado Metalworks",
    location: "Kado, Abuja",
    pay: "₦18,000 / day",
  },
];

const APPLICATIONS: {
  role: string;
  company: string;
  applied: string;
  status: StatusKey;
}[] = [
  {
    role: "Plumber",
    company: "Zenith Estates",
    applied: "2 days ago",
    status: "SHORTLISTED",
  },
  {
    role: "Painter",
    company: "Coral Homes",
    applied: "4 days ago",
    status: "PENDING",
  },
  {
    role: "Bricklayer",
    company: "Northgate Build",
    applied: "1 week ago",
    status: "REJECTED",
  },
];

function StatCard({ label, value, note, icon: Icon }: Stat) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-neutral-500">{label}</span>
        <span className="grid size-8 place-items-center rounded-full bg-[#E6F4EC] text-[#0B3D2E]">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-[#0B3D2E]">
        {value}
      </p>
      <p className="mt-1 text-xs text-neutral-400">{note}</p>
    </div>
  );
}

function JobRow({ job }: { job: (typeof RECOMMENDED_JOBS)[number] }) {
  return (
    <li className="flex items-center gap-4 rounded-xl px-3 py-3 transition-colors hover:bg-[#F5F7F5]">
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#E9E4FA] text-sm font-semibold text-[#4B3A8F]">
        {job.company.charAt(0)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-[#0B3D2E]">{job.title}</p>
        <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-neutral-500">
          {job.company} <span aria-hidden>·</span> <MapPin className="size-3" />{" "}
          {job.location}
        </p>
      </div>
      <span className="hidden text-sm text-neutral-600 sm:block">
        {job.pay}
      </span>
      <button
        aria-label="Save job"
        className="rounded-full p-2 text-neutral-400 hover:bg-white hover:text-[#0B3D2E]"
      >
        <Bookmark className="size-4" />
      </button>
    </li>
  );
}

function ApplicationRow({ item }: { item: (typeof APPLICATIONS)[number] }) {
  const status = APPLICATION_STATUS[item.status];
  return (
    <li className="flex items-center justify-between gap-3 py-3">
      <div>
        <p className="text-sm font-medium text-[#0B3D2E]">{item.role}</p>
        <p className="text-xs text-neutral-500">
          {item.company} · {item.applied}
        </p>
      </div>
      <span
        className={`rounded-full px-2.5 py-1 text-xs font-medium ${status.style}`}
      >
        {status.label}
      </span>
    </li>
  );
}

function ProfileStrengthCard() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-[#0B3D2E] p-6 text-white">
      <div
        aria-hidden
        className="absolute inset-0 opacity-20 [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:14px_14px]"
      />
      <div className="relative">
        <p className="text-sm text-white/70">Profile strength</p>
        <p className="mt-2 text-4xl font-semibold">72%</p>
        <div className="mt-4 h-1.5 rounded-full bg-white/15">
          <div className="h-full w-[72%] rounded-full bg-[#1DBF73]" />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-white/80">
          Add your work references to move up. Complete profiles get shortlisted
          more often.
        </p>
        <button className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#1DBF73] px-4 py-2 text-sm font-medium text-[#062A1F] hover:brightness-95">
          Complete profile <ArrowUpRight className="size-4" />
        </button>
      </div>
    </section>
  );
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#F5F7F5] px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm text-neutral-500">Welcome back</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#0B3D2E]">
              Find your next job
            </h1>
          </div>
          <div className="flex w-full max-w-md items-center gap-2 rounded-full border border-black/5 bg-white p-1.5 pl-4">
            <Search className="size-4 text-neutral-400" />
            <input
              placeholder="Search trade or location"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-400"
            />
            <button className="rounded-full bg-[#1DBF73] px-5 py-2 text-sm font-medium text-[#062A1F]">
              Search
            </button>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-2xl border border-black/5 bg-white p-4 lg:col-span-2">
            <div className="flex items-center justify-between px-3 pb-2 pt-2">
              <h2 className="font-semibold text-[#0B3D2E]">
                Recommended for you
              </h2>
              <a
                href="/dashboard/jobs"
                className="text-sm text-[#12915A] hover:underline"
              >
                View all
              </a>
            </div>
            <ul>
              {RECOMMENDED_JOBS.map((job) => (
                <JobRow key={job.title} job={job} />
              ))}
            </ul>
          </section>

          <div className="space-y-6">
            <ProfileStrengthCard />
            <section className="rounded-2xl border border-black/5 bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-[#0B3D2E]">
                  My applications
                </h2>
                <a
                  href="/dashboard/applications"
                  className="text-sm text-[#12915A] hover:underline"
                >
                  See all
                </a>
              </div>
              <ul className="mt-2 divide-y divide-black/5">
                {APPLICATIONS.map((item) => (
                  <ApplicationRow key={item.role} item={item} />
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
