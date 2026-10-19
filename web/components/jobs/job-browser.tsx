"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal } from "lucide-react";
import {
  EmptyState,
  ErrorNote,
  LoadingNote,
  PageContainer,
  PageHeader,
} from "@/components/layout/page";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/api-error";
import { JobCard } from "./job-card";
import { JobFilters } from "./job-filters";
import type { Job, JobFacets, PaymentType } from "@/types/job";
import { jobsApi } from "@/lib/job";
import { cn } from "cn";

const EMPTY_FACETS: JobFacets = { paymentType: [], skills: [] };

const selectClass =
  "h-9 rounded-full border border-black/10 bg-white px-3 text-sm text-brand outline-none focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/25";

export function JobsBrowser({ initialSearch = "" }: { initialSearch?: string }) {
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

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
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );
  };

  const toggleSkill = (value: string) => {
    setPage(1);
    setSkills((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );
  };

  const clearFilters = () => {
    setPage(1);
    setPaymentTypes([]);
    setSkills([]);
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const activeFilters = paymentTypes.length + skills.length;

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Browse jobs"
        title="Find your next opportunity"
        description="Search open listings by trade, skill or location, then send a short proposal."
      />

      <div className="flex items-center gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-black/5 bg-white p-1.5 pl-4">
          <Search aria-hidden className="size-4 shrink-0 text-neutral-400" />
          <input
            type="search"
            aria-label="Search jobs"
            placeholder="Search by job title, skill or keyword"
            value={search}
            onChange={(event) => {
              setPage(1);
              setSearch(event.target.value);
            }}
            className="h-8 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-400"
          />
        </div>
        <Button
          variant="outline"
          className="lg:hidden"
          aria-expanded={showFilters}
          aria-controls="job-filters"
          onClick={() => setShowFilters((value) => !value)}
        >
          <SlidersHorizontal />
          Filters{activeFilters > 0 ? ` (${activeFilters})` : ""}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start">
        <div
          id="job-filters"
          className={cn(showFilters ? "block" : "hidden", "lg:sticky lg:top-24 lg:block")}
        >
          <JobFilters
            facets={facets}
            selectedPaymentTypes={paymentTypes}
            selectedSkills={skills}
            onTogglePaymentType={togglePaymentType}
            onToggleSkill={toggleSkill}
            onClear={clearFilters}
          />
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-neutral-500" aria-live="polite">
              Showing {jobs.length} of {total} jobs
            </p>
            <div className="flex items-center gap-2">
              <label className="sr-only" htmlFor="page-size">
                Jobs per page
              </label>
              <select
                id="page-size"
                className={selectClass}
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
              >
                {[10, 20, 30, 50].map((size) => (
                  <option key={size} value={size}>
                    {size} per page
                  </option>
                ))}
              </select>
              <label className="sr-only" htmlFor="sort">
                Sort order
              </label>
              <select
                id="sort"
                className={selectClass}
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

          {error && <ErrorNote message={error} />}
          {isLoading && <LoadingNote message="Loading jobs..." />}
          {!isLoading && !error && jobs.length === 0 && (
            <EmptyState message="No jobs match your search or filters." />
          )}

          {!isLoading && jobs.map((job) => <JobCard key={job.id} job={job} />)}

          {total > pageSize && (
            <nav aria-label="Pagination" className="flex items-center justify-between gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1 || isLoading}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                <ChevronLeft /> Previous
              </Button>
              <span className="text-sm text-neutral-500">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages || isLoading}
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              >
                Next <ChevronRight />
              </Button>
            </nav>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
