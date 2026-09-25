"use client";
import { useEffect, useState } from "react";
import { AdminUserListPage } from "@/components/admin/admin-list-page";
import { adminApi } from "@/lib/api/admin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdministratorsPage() {
  const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [message,setMessage]=useState(""); const [busy,setBusy]=useState(false);
  const create=async()=>{setBusy(true);setMessage("");try{await adminApi.createAdmin({email,password});setEmail("");setPassword("");setMessage("Administrator created successfully.")}catch(e){setMessage(e instanceof Error?e.message:"Failed to create administrator")}finally{setBusy(false)}};
  return <div className="space-y-8"><section className="rounded-xl border p-5"><h1 className="text-xl font-bold">Create Administrator</h1><p className="mb-4 text-sm text-muted-foreground">Create another administrator account. The API restricts this operation to administrators.</p><div className="grid gap-3 sm:grid-cols-2"><Input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/><Input type="password" placeholder="Temporary password" value={password} onChange={e=>setPassword(e.target.value)}/></div><div className="mt-3 flex items-center gap-3"><Button onClick={create} disabled={busy||!email||!password}>{busy?"Creating...":"Create administrator"}</Button>{message&&<p className="text-sm">{message}</p>}</div></section><AdminUserListPage title="Administrators" role="admin" /></div>;
}
