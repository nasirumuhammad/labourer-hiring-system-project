import { apiClient, authRequest } from "./api-client";
import { ApiSuccessResponse } from "@/types/api";
import { UserRole, JobStatus, ApplicationStatus, PaymentType } from "@labour-hiring/enums";

export type AdminUser = {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
  deletedAt?: string | null;
  profile?: { firstName: string; lastName: string; phoneNumber: string; state: string; lga: string; address: string } | null;
};
export type AdminJob = { id: string; title: string; companyName: string; description: string; location?: string; employerId: string; paymentType: PaymentType; minPay: string; maxPay: string; status: JobStatus; createdAt: string; deletedAt?: string | null; employer?: AdminUser };
export type AdminApplication = { id: string; proposal: string; status: ApplicationStatus; createdAt: string; deletedAt?: string | null; applicant?: AdminUser; job?: AdminJob };
export type Paginated<T> = { data: T[]; total: number; page: number; limit: number };
export type Dashboard = { users: { total: number; labourers: number; employers: number; admins: number; active: number; deactivated: number }; jobs: { total: number; open: number; closed: number; draft: number }; applications: { total: number; pending: number; accepted: number; rejected: number }; recentUsers: AdminUser[]; recentJobs: AdminJob[]; recentApplications: AdminApplication[] };

async function unwrap<T>(request: Promise<ApiSuccessResponse<T> | undefined>): Promise<T> {
  const response = await request;
  if (!response?.data) throw new Error(response?.message ?? "No data returned");
  return response.data;
}

const qs = (params: Record<string, string | number | undefined>) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => { if (value !== undefined && value !== "") search.set(key, String(value)); });
  const value = search.toString();
  return value ? `?${value}` : "";
};

export const adminApi = {
  dashboard: () => unwrap(apiClient.get<Dashboard>("/admin/dashboard")),
  createAdmin: (payload: { email: string; password: string }) => authRequest<AdminUser>("/signup/admin", payload).then(r => { if (!r?.data) throw new Error(r?.message ?? "Failed to create administrator"); return r.data; }),
  users: (params: { role?: UserRole; status?: "active" | "deactivated"; search?: string; page?: number; limit?: number } = {}) => unwrap(apiClient.get<Paginated<AdminUser>>(`/admin/users${qs(params)}`)),
  user: (id: string) => unwrap(apiClient.get<{ user: AdminUser; jobs: AdminJob[]; applications: AdminApplication[] }>(`/admin/users/${id}`)),
  deactivateUser: (id: string) => unwrap(apiClient.update<{ message: string }>(`/admin/users/${id}/deactivate`, {})),
  reactivateUser: (id: string) => unwrap(apiClient.update<{ message: string }>(`/admin/users/${id}/reactivate`, {})),
  jobs: (params: { status?: JobStatus; paymentType?: PaymentType; search?: string; page?: number; limit?: number } = {}) => unwrap(apiClient.get<Paginated<AdminJob>>(`/admin/jobs${qs(params)}`)),
  job: (id: string) => unwrap(apiClient.get<{ job: AdminJob; applicationCount: number; applications: AdminApplication[] }>(`/admin/jobs/${id}`)),
  setJobStatus: (id: string, status: JobStatus) => unwrap(apiClient.update<AdminJob>(`/admin/jobs/${id}/status`, { status })),
  deleteJob: (id: string) => unwrap(apiClient.delete<{ message: string }>(`/admin/jobs/${id}`, undefined)),
  applications: (params: { status?: ApplicationStatus; search?: string; page?: number; limit?: number } = {}) => unwrap(apiClient.get<Paginated<AdminApplication>>(`/admin/applications${qs(params)}`)),
  application: (id: string) => unwrap(apiClient.get<AdminApplication>(`/admin/applications/${id}`)),
  deleteApplication: (id: string) => unwrap(apiClient.delete<{ message: string }>(`/admin/applications/${id}`, undefined)),
  auditLogs: (page = 1, limit = 20) => unwrap(apiClient.get<{ data: { id: string; adminId: string; action: string; entityType: string; entityId?: string; createdAt: string }[]; total: number; page: number; limit: number }>(`/admin/audit-logs?page=${page}&limit=${limit}`)),
};
