"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { JobFacets, PaymentType } from "@/types/job";

interface JobFiltersProps {
  facets: JobFacets;
  selectedPaymentTypes: PaymentType[];
  selectedSkills: string[];
  onTogglePaymentType: (value: PaymentType) => void;
  onToggleSkill: (value: string) => void;
  onClear: () => void;
}

const checkbox = "size-4 shrink-0 rounded border-input accent-[#1DBF73]";

export function JobFilters({
  facets,
  selectedPaymentTypes,
  selectedSkills,
  onTogglePaymentType,
  onToggleSkill,
  onClear,
}: JobFiltersProps) {
  const [skillSearch, setSkillSearch] = useState("");

  const visibleSkills = facets.skills.filter((skill) =>
    skill.value.toLowerCase().includes(skillSearch.toLowerCase()),
  );

  return (
    <div className="flex w-full flex-col gap-6 rounded-2xl border border-black/5 bg-white p-4 sm:p-5">
      <h2 className="font-semibold text-brand">Filters</h2>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-sm font-medium text-brand">Payment type</legend>
        {facets.paymentType.map((facet) => (
          <label
            key={facet.value}
            className="flex cursor-pointer items-center justify-between gap-3 py-0.5 text-sm"
          >
            <span className="flex items-center gap-2.5">
              <input
                type="checkbox"
                className={checkbox}
                checked={selectedPaymentTypes.includes(facet.value)}
                onChange={() => onTogglePaymentType(facet.value)}
              />
              {facet.value === "fixed" ? "Fixed" : "Hourly"}
            </span>
            <span className="text-xs text-neutral-400">{facet.count}</span>
          </label>
        ))}
        {facets.paymentType.length === 0 && (
          <p className="text-sm text-neutral-500">No options yet</p>
        )}
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-sm font-medium text-brand">Skills</legend>
        <Input
          placeholder="Search skills"
          aria-label="Search skills"
          value={skillSearch}
          onChange={(event) => setSkillSearch(event.target.value)}
          className="h-10"
        />
        <div className="flex max-h-56 flex-col gap-2 overflow-y-auto pr-1">
          {visibleSkills.map((facet) => (
            <label
              key={facet.value}
              className="flex cursor-pointer items-center justify-between gap-3 py-0.5 text-sm"
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <input
                  type="checkbox"
                  className={checkbox}
                  checked={selectedSkills.includes(facet.value)}
                  onChange={() => onToggleSkill(facet.value)}
                />
                <span className="truncate">{facet.value}</span>
              </span>
              <span className="text-xs text-neutral-400">{facet.count}</span>
            </label>
          ))}
          {visibleSkills.length === 0 && (
            <p className="text-sm text-neutral-500">No skills found</p>
          )}
        </div>
      </fieldset>

      <Button variant="outline" onClick={onClear}>
        Clear filters
      </Button>
    </div>
  );
}
