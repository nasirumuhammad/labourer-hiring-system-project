"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminApi, AdminUser } from "@/lib/api/admin";
import { UserRole } from "@labour-hiring/enums";
import Link from "next/link";

export function AdminUserListPage({ role, title }: { role?: UserRole; title: string }) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"active" | "deactivated" | "">("");
  const [loading, setLoading] = useState(true);
  const load = () => { setLoading(true); adminApi.users({ role, search, status: status || undefined, limit: 20 }).then(r => setUsers(r.data)).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, [role]);
  return <div className="space-y-5"><div><h1 className="text-2xl font-bold">{title}</h1><p className="text-sm text-muted-foreground">Manage platform accounts.</p></div><div className="flex gap-2"><Input placeholder="Search by name or email" value={search} onChange={e => setSearch(e.target.value)} /><select className="h-9 rounded-lg border bg-background px-3 text-sm" value={status} onChange={e => setStatus(e.target.value as typeof status)}><option value="">All status</option><option value="active">Active</option><option value="deactivated">Deactivated</option></select><Button onClick={load}>Search</Button></div>{loading ? <p>Loading...</p> : <div className="overflow-x-auto rounded-xl border"><table className="w-full text-sm"><thead className="bg-muted/50"><tr><th className="p-3 text-left">Name</th><th className="p-3 text-left">Email</th><th className="p-3 text-left">Role</th><th className="p-3 text-left">Status</th><th className="p-3 text-left">Created</th><th /></tr></thead><tbody>{users.map(user => <tr key={user.id} className="border-t"><td className="p-3">{user.profile ? `${user.profile.firstName} ${user.profile.lastName}` : "—"}</td><td className="p-3">{user.email}</td><td className="p-3 capitalize">{user.role}</td><td className="p-3">{user.deletedAt ? "Deactivated" : "Active"}</td><td className="p-3">{new Date(user.createdAt).toLocaleDateString()}</td><td className="p-3 text-right"><Link className="text-primary underline" href={`/admin/users/${user.id}`}>View</Link></td></tr>)}</tbody></table></div>}</div>;
}
