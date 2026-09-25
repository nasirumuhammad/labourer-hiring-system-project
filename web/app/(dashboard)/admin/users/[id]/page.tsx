"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { adminApi } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Awaited<ReturnType<typeof adminApi.user>> | null>(null);
  const load = () => adminApi.user(id).then(setData);
  useEffect(() => { if (id) load(); }, [id]);
  if (!data) return <p>Loading...</p>;
  const { user } = data;
  const toggle = () => (user.deletedAt ? adminApi.reactivateUser(id) : adminApi.deactivateUser(id)).then(load);
  return <div className="space-y-6"><div className="flex items-start justify-between gap-4"><div><h1 className="text-2xl font-bold">{user.profile ? `${user.profile.firstName} ${user.profile.lastName}` : user.email}</h1><p className="text-sm text-muted-foreground">{user.email} · {user.role}</p></div><Button variant={user.deletedAt ? "default" : "destructive"} onClick={toggle}>{user.deletedAt ? "Reactivate" : "Deactivate"}</Button></div><div className="rounded-xl border p-5"><h2 className="font-semibold">Profile</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{Object.entries(user.profile ?? {}).map(([k,v]) => <div key={k}><p className="text-xs text-muted-foreground capitalize">{k}</p><p>{String(v)}</p></div>)}</div></div>{data.jobs.length > 0 && <div className="rounded-xl border p-5"><h2 className="font-semibold">Jobs</h2>{data.jobs.map(j => <div key={j.id} className="border-b py-3 last:border-0"><p className="font-medium">{j.title}</p><p className="text-sm text-muted-foreground">{j.status} · {j.companyName}</p></div>)}</div>}{data.applications.length > 0 && <div className="rounded-xl border p-5"><h2 className="font-semibold">Applications</h2>{data.applications.map(a => <div key={a.id} className="border-b py-3 last:border-0"><p className="font-medium">{a.job?.title}</p><p className="text-sm text-muted-foreground">{a.status}</p></div>)}</div>}</div>;
}
