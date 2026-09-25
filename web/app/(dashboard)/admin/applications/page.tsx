"use client";
import { useEffect, useState } from "react";
import { adminApi, AdminApplication } from "@/lib/api/admin";
import { ApplicationStatus } from "@labour-hiring/enums";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminApplicationsPage() {
  const [items, setItems] = useState<AdminApplication[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ApplicationStatus | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await adminApi.applications({ search, status: status || undefined, limit: 50 });
      setItems(result.data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const remove = async (application: AdminApplication) => {
    if (!window.confirm("Remove this application?")) return;
    setError(null);
    try {
      await adminApi.deleteApplication(application.id);
      await load();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to remove application");
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Applications</h1>
        <p className="text-sm text-muted-foreground">Monitor and moderate submitted applications.</p>
      </div>
      <div className="flex gap-2">
        <Input placeholder="Search applicant or job" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="h-9 rounded-lg border bg-background px-3 text-sm" value={status} onChange={(e) => setStatus(e.target.value as ApplicationStatus | "")}>
          <option value="">All status</option>
          {Object.values(ApplicationStatus).map((value) => <option key={value} value={value}>{value}</option>)}
        </select>
        <Button onClick={() => void load()}>Search</Button>
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {loading ? <p>Loading...</p> : (
        <div className="space-y-3">
          {items.map((application) => (
            <div key={application.id} className="rounded-xl border p-4">
              <div className="flex justify-between gap-4">
                <div>
                  <p className="font-semibold">{application.job?.title}</p>
                  <p className="text-sm text-muted-foreground">{application.applicant?.email} · {application.status} · {new Date(application.createdAt).toLocaleDateString()}</p>
                  <p className="mt-3 whitespace-pre-wrap text-sm">{application.proposal}</p>
                </div>
                <Button size="sm" variant="destructive" onClick={() => void remove(application)}>Remove</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
