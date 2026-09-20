"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api/api-error";
import { JobCard } from "./job-card";
import { JobFilters } from "./job-filters";
import type { JobFacets, PaymentType, Job } from "@/types/job";
import { jobsApi } from "@/lib/job";

const EMPTY_FACETS: JobFacets = { paymentType: [], skills: [] };

export function JobsBrowser() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);
  const [skills, setSkills] = useState<string[]>([]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [facets, setFacets] = useState<JobFacets>(EMPTY_FACETS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchJobs() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await jobsApi.list({
          search: search || undefined,
          sort,
          paymentType: paymentTypes.length ? paymentTypes : undefined,
          skills: skills.length ? skills : undefined,
          page,
          limit: pageSize,
        });
        if (controller.signal.aborted) return;
        setJobs(response?.data?.data ?? []);
        setTotal(response?.data?.total ?? 0);
        setFacets(response?.data?.facets ?? EMPTY_FACETS);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof ApiError ? err.message : "Failed to load jobs");
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    const debounce = setTimeout(fetchJobs, 300);
    return () => {
      clearTimeout(debounce);
      controller.abort();
    };
  }, [search, sort, paymentTypes, skills, page, pageSize]);

  const togglePaymentType = (value: PaymentType) => {
    setPage(1);

    setPaymentTypes((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  };

  const toggleSkill = (value: string) => {
    setPage(1);

    setSkills((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  };

  const clearFilters = () => {
    setPage(1);
    setPaymentTypes([]);
    setSkills([]);
  };

  return (
    <div className="flex flex-col">
      <div className="border-b bg-muted/30 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold">Find Your Next Opportunity</h1>
          <p className="mt-1 text-muted-foreground">
            Browse through our latest job listings and take the next step in
            your career.
          </p>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4">
        <Input
          placeholder="Search by job title, skill or keyword..."
          value={search}
          onChange={(event) => {
            setPage(1);
            setSearch(event.target.value);
          }}
        />

        <div className="flex flex-col gap-6 md:flex-row">
          <JobFilters
            facets={facets}
            selectedPaymentTypes={paymentTypes}
            selectedSkills={skills}
            onTogglePaymentType={togglePaymentType}
            onToggleSkill={toggleSkill}
            onClear={clearFilters}
          />

          <div className="flex flex-1 flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {jobs.length} of {total} jobs
              </p>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Per page</span>

                <select
                  className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
                  value={pageSize}
                  onChange={(event) => {
                    setPageSize(Number(event.target.value));
                    setPage(1);
                  }}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option value={50}>50</option>
                </select>

                <select
                  className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
                  value={sort}
                  onChange={(event) => {
                    setPage(1);
                    setSort(event.target.value as "newest" | "oldest");
                  }}
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            {isLoading && (
              <p className="text-sm text-muted-foreground">Loading jobs...</p>
            )}
            {!isLoading && !error && jobs.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No jobs match your filters.
              </p>
            )}
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
