import type {
  ApplyJobDto,
  JobQueryParams,
  PaginatedApplications,
  PaginatedJobs,
  Job,
} from "@/types/job";
import { apiClient } from "./api/api-client";

function buildQueryString(params: JobQueryParams): string {
  const search = new URLSearchParams();

  if (params.search) search.set("search", params.search);
  if (params.sort) search.set("sort", params.sort);
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  params.paymentType?.forEach((value) => search.append("paymentType", value));
  params.skills?.forEach((value) => search.append("skills", value));

  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export const jobsApi = {
  list: (params: JobQueryParams = {}) =>
    apiClient.get<PaginatedJobs>(`/jobs${buildQueryString(params)}`),

  getById: (id: string) => apiClient.get<Job>(`/jobs/${id}`),

  apply: (jobId: string, payload: ApplyJobDto) =>
    apiClient.post<{ id: string }>(`/jobs/${jobId}/apply`, payload),

  myApplications: (page = 1, limit = 10) =>
    apiClient.get<PaginatedApplications>(
      `/applications/me?page=${page}&limit=${limit}`,
    ),
};
