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
    <div className="flex w-full flex-col gap-6 rounded-xl border bg-card p-4 md:w-72 md:shrink-0">
      <h2 className="font-semibold">Filters</h2>

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-medium">Payment Type</h3>
        {facets.paymentType.map((facet) => (
          <label
            key={facet.value}
            className="flex cursor-pointer items-center justify-between text-sm"
          >
            <span className="flex items-center gap-2">
              <input
                type="checkbox"
                className="size-4 rounded border-input"
                checked={selectedPaymentTypes.includes(facet.value)}
                onChange={() => onTogglePaymentType(facet.value)}
              />
              {facet.value === "fixed" ? "Fixed" : "Hourly"}
            </span>
            <span className="text-muted-foreground">{facet.count}</span>
          </label>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-medium">Skills &amp; Experience</h3>
        <Input
          placeholder="Search skills or experience..."
          value={skillSearch}
          onChange={(event) => setSkillSearch(event.target.value)}
        />
        <div className="flex max-h-64 flex-col gap-2 overflow-y-auto">
          {visibleSkills.map((facet) => (
            <label
              key={facet.value}
              className="flex cursor-pointer items-center justify-between text-sm"
            >
              <span className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="size-4 rounded border-input"
                  checked={selectedSkills.includes(facet.value)}
                  onChange={() => onToggleSkill(facet.value)}
                />
                {facet.value}
              </span>
              <span className="text-muted-foreground">{facet.count}</span>
            </label>
          ))}
          {visibleSkills.length === 0 && (
            <p className="text-sm text-muted-foreground">No skills found</p>
          )}
        </div>
      </div>

      <Button variant="outline" onClick={onClear}>
        Clear Filters
      </Button>
    </div>
  );
}
