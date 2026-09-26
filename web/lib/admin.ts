import type {
  AdminApplication,
  AdminApplicationsQueryParams,
  AdminJob,
  AdminJobDetail,
  AdminJobsQueryParams,
  AdminUser,
  AdminUserDetail,
  AdminUsersQueryParams,
  AuditLog,
  CreateAdminDto,
  CreatedAdminUser,
  Dashboard,
  Paginated,
} from "@/types/admin";
import { JobStatus } from "@labour-hiring/enums";
import { apiClient } from "./api/api-client";

function buildUsersQuery(params: AdminUsersQueryParams): string {
  const search = new URLSearchParams();

  if (params.role) search.set("role", params.role);
  if (params.status) search.set("status", params.status);
  if (params.search) search.set("search", params.search);
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));

  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

function buildJobsQuery(params: AdminJobsQueryParams): string {
  const search = new URLSearchParams();

  if (params.status) search.set("status", params.status);
  if (params.paymentType) search.set("paymentType", params.paymentType);
  if (params.search) search.set("search", params.search);
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));

  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

function buildApplicationsQuery(params: AdminApplicationsQueryParams): string {
  const search = new URLSearchParams();

  if (params.status) search.set("status", params.status);
  if (params.search) search.set("search", params.search);
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));

  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export const adminApi = {
  dashboard: () => apiClient.get<Dashboard>("/admin/dashboard"),

  users: (params: AdminUsersQueryParams = {}) =>
    apiClient.get<Paginated<AdminUser>>(
      `/admin/users${buildUsersQuery(params)}`,
    ),

  user: (id: string) => apiClient.get<AdminUserDetail>(`/admin/users/${id}`),

  deactivateUser: (id: string) =>
    apiClient.update<{ message: string }>(`/admin/users/${id}/deactivate`, {}),

  reactivateUser: (id: string) =>
    apiClient.update<{ message: string }>(`/admin/users/${id}/reactivate`, {}),

  createAdmin: (payload: CreateAdminDto) =>
    apiClient.post<CreatedAdminUser>("/auth/signup/admin", payload),

  jobs: (params: AdminJobsQueryParams = {}) =>
    apiClient.get<Paginated<AdminJob>>(`/admin/jobs${buildJobsQuery(params)}`),

  job: (id: string) => apiClient.get<AdminJobDetail>(`/admin/jobs/${id}`),

  setJobStatus: (id: string, status: JobStatus) =>
    apiClient.update<AdminJob>(`/admin/jobs/${id}/status`, { status }),

  deleteJob: (id: string) =>
    apiClient.delete<{ message: string }>(`/admin/jobs/${id}`, undefined),

  applications: (params: AdminApplicationsQueryParams = {}) =>
    apiClient.get<Paginated<AdminApplication>>(
      `/admin/applications${buildApplicationsQuery(params)}`,
    ),

  application: (id: string) =>
    apiClient.get<AdminApplication>(`/admin/applications/${id}`),

  deleteApplication: (id: string) =>
    apiClient.delete<{ message: string }>(
      `/admin/applications/${id}`,
      undefined,
    ),

  auditLogs: (page = 1, limit = 20) =>
    apiClient.get<Paginated<AuditLog>>(
      `/admin/audit-logs?page=${page}&limit=${limit}`,
    ),
};
