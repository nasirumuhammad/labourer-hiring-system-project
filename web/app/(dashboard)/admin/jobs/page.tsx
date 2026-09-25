"use client";
import { useEffect, useState } from "react";
import { adminApi, AdminJob } from "@/lib/api/admin";
import { JobStatus } from "@labour-hiring/enums";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<AdminJob[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<JobStatus | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await adminApi.jobs({ search, status: status || undefined, limit: 50 });
      setJobs(result.data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const toggle = async (job: AdminJob) => {
    setError(null);
    try {
      await adminApi.setJobStatus(
        job.id,
        job.status === JobStatus.OPEN ? JobStatus.CLOSED : JobStatus.OPEN,
      );
      await load();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update job status");
    }
  };

  const remove = async (job: AdminJob) => {
    if (!window.confirm(`Delete \"${job.title}\"?`)) return;
    setError(null);
    try {
      await adminApi.deleteJob(job.id);
      await load();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to delete job");
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Jobs</h1>
        <p className="text-sm text-muted-foreground">Moderate all job postings.</p>
      </div>
      <div className="flex gap-2">
        <Input placeholder="Search jobs" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="h-9 rounded-lg border bg-background px-3 text-sm" value={status} onChange={(e) => setStatus(e.target.value as JobStatus | "")}>
          <option value="">All status</option>
          {Object.values(JobStatus).map((value) => <option key={value} value={value}>{value}</option>)}
        </select>
        <Button onClick={() => void load()}>Search</Button>
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {loading ? <p>Loading...</p> : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={job.id} className="rounded-xl border p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{job.title}</p>
                  <p className="text-sm text-muted-foreground">{job.companyName} · {job.paymentType} · {job.status}</p>
                </div>
                <div className="flex gap-2">
                  {job.status === JobStatus.OPEN || job.status === JobStatus.CLOSED ? (
                    <Button size="sm" variant="outline" onClick={() => void toggle(job)}>
                      {job.status === JobStatus.OPEN ? "Close" : "Reopen"}
                    </Button>
                  ) : null}
                  <Button size="sm" variant="destructive" onClick={() => void remove(job)}>Delete</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
