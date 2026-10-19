import { Brand } from "@/components/layout/brand";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <aside className="relative hidden overflow-hidden bg-brand p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div aria-hidden className="bg-dots absolute inset-0 opacity-20" />
        <Brand
          href="/"
          className="relative text-white [&>span]:bg-primary [&>span]:text-primary-foreground"
        />
        <div className="relative max-w-sm">
          <p className="text-3xl font-semibold leading-snug">
            Hire a plumber by Friday. Find a job by Monday.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            Day jobs and short contracts for tradespeople across Nigeria, with
            payout details on file from day one.
          </p>
        </div>
        <p className="relative text-xs text-white/50">
          © {new Date().getFullYear()} JobLink
        </p>
      </aside>

      <div className="flex flex-col px-4 py-6 sm:px-8">
        <Brand href="/" className="lg:hidden" />
        <div className="flex flex-1 items-center justify-center py-8">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
