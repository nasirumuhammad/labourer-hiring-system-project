import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "cn";

/** Standard page width + gutters. Content stays readable on desktop, edge-padded on phones. */
export function PageContainer({
  children,
  width = "6xl",
  className,
}: {
  children: ReactNode;
  width?: "2xl" | "3xl" | "4xl" | "6xl" | "7xl";
  className?: string;
}) {
  const max = {
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
  }[width];
  return (
    <div
      className={cn(
        "mx-auto w-full space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8",
        max,
        className,
      )}
    >
      {children}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="text-sm text-neutral-500">{eyebrow}</p>}
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-brand sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-500">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}

/** White rounded surface used for lists, tables and forms. */
export function Panel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn("rounded-2xl border border-black/5 bg-white p-4 sm:p-5", className)}
    >
      {children}
    </section>
  );
}

export function PanelHeading({
  title,
  href,
  hrefLabel,
}: {
  title: string;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-1 pb-3">
      <h2 className="font-semibold text-brand">{title}</h2>
      {href && (
        <Link href={href} className="text-sm text-link hover:underline">
          {hrefLabel ?? "View all"}
        </Link>
      )}
    </div>
  );
}

/** Dark green feature card with the dotted texture. */
export function DotCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn("relative overflow-hidden rounded-2xl bg-brand p-6 text-white", className)}
    >
      <div aria-hidden className="bg-dots absolute inset-0 opacity-20" />
      <div className="relative">{children}</div>
    </section>
  );
}

export function EmptyState({ message }: { message: string }) {
  return <p className="px-2 py-8 text-center text-sm text-neutral-500">{message}</p>;
}

export function ErrorNote({ message }: { message: string }) {
  return (
    <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
      {message}
    </p>
  );
}

export function LoadingNote({ message = "Loading..." }: { message?: string }) {
  return (
    <p className="px-2 py-8 text-center text-sm text-neutral-500" aria-live="polite">
      {message}
    </p>
  );
}

/** Company initial tile used next to jobs, applications and users. */
export function InitialTile({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-11 shrink-0 place-items-center rounded-xl bg-violet-soft text-sm font-semibold text-violet-ink",
        className,
      )}
    >
      {text.charAt(0).toUpperCase() || "?"}
    </span>
  );
}
