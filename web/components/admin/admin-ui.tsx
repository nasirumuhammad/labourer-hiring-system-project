import type { ReactNode } from "react";
import { cn } from "cn";

export const selectClass =
  "h-11 rounded-xl border border-input bg-card px-3 text-sm text-brand outline-none focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/25 sm:h-11";

export function AdminHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <header>
      <h1 className="text-2xl font-semibold tracking-tight text-brand sm:text-3xl">{title}</h1>
      {description && <p className="mt-1 text-sm text-neutral-500">{description}</p>}
    </header>
  );
}

/** Search row: stacks on phones, sits in one line from the sm breakpoint. */
export function FilterBar({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-2 sm:flex-row">{children}</div>;
}

/** Responsive table: a real table from md, stacked cards on phones. */
export function DataTable({
  head,
  children,
  className,
}: {
  head: string[];
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-black/5 bg-white", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-background text-left text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              {head.map((label, index) => (
                <th key={`${label}-${index}`} scope="col" className="px-4 py-3 font-medium">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">{children}</tbody>
        </table>
      </div>
    </div>
  );
}

export const cell = "px-4 py-3 align-middle";
