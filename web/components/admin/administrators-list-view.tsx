"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserRole } from "@labour-hiring/enums";
import { AdminUserListPage } from "@/components/admin/admin-list-page";
import { AdminHeading } from "@/components/admin/admin-ui";
import { Panel } from "@/components/layout/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminApi } from "@/lib/admin";
import type { AdminUser } from "@/types/admin";
import { cn } from "cn";

export default function AdministratorsListView({
  administrators,
}: {
  administrators: AdminUser[];
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [busy, setBusy] = useState(false);

  const create = async () => {
    setBusy(true);
    setMessage(null);
    try {
      await adminApi.createAdmin({ email, password });
      setEmail("");
      setPassword("");
      setMessage({ text: "Administrator created successfully.", ok: true });
      router.refresh();
    } catch (e) {
      setMessage({
        text: e instanceof Error ? e.message : "Failed to create administrator",
        ok: false,
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-8">
      <Panel className="p-5 sm:p-6">
        <AdminHeading
          title="Create administrator"
          description="Create another administrator account. The API restricts this operation to administrators."
        />
        <form
          className="mt-5 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            void create();
          }}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              type="email"
              aria-label="Email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              aria-label="Temporary password"
              placeholder="Temporary password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button type="submit" disabled={busy || !email || !password}>
              {busy ? "Creating..." : "Create administrator"}
            </Button>
            {message && (
              <p
                role="status"
                className={cn("text-sm", message.ok ? "text-link" : "text-red-600")}
              >
                {message.text}
              </p>
            )}
          </div>
        </form>
      </Panel>

      <AdminUserListPage title="Administrators" users={administrators} role={UserRole.ADMIN} />
    </div>
  );
}
