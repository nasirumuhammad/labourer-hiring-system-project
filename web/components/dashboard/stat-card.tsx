import type { LucideIcon } from "lucide-react";

export interface StatDisplay {
  label: string;
  value: number;
  note: string;
  icon: LucideIcon;
}

export function StatCard({ label, value, note, icon: Icon }: StatDisplay) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-neutral-500">{label}</span>
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
          <Icon aria-hidden className="size-4" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-brand sm:mt-4 sm:text-3xl">
        {value}
      </p>
      <p className="mt-1 text-xs text-neutral-400">{note}</p>
    </div>
  );
}
