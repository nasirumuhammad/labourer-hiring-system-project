export type PaymentType = "fixed" | "hourly";
export type JobStatus = "open" | "closed" | "draft";
export type ApplicationStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "withdrawn";

export interface Job {
  id: string;
  title: string;
  companyName: string;
  description: string;
  location?: string;
  employerId: string;
  paymentType: PaymentType;
  minPay: string;
  maxPay: string;
  minExperienceYears: number;
  skills: string[];
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
}

export interface FacetCount<T = string> {
  value: T;
  count: number;
}

export interface JobFacets {
  paymentType: FacetCount<PaymentType>[];
  skills: FacetCount[];
}

export interface PaginatedJobs {
  data: Job[];
  total: number;
  page: number;
  limit: number;
  facets: JobFacets;
}

export interface Application {
  id: string;
  jobId: string;
  job?: Job;
  applicantId: string;
  applicant?: { id: string; email: string };
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedApplications {
  data: Application[];
  total: number;
  page: number;
  limit: number;
}

export interface PaginatedMyJobs {
  data: Job[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateJobDto {
  title: string;
  companyName: string;
  description: string;
  location?: string;
  paymentType: PaymentType;
  minPay: string;
  maxPay: string;
  minExperienceYears?: number;
  skills?: string[];
}

export interface JobQueryParams {
  search?: string;
  paymentType?: PaymentType[];
  skills?: string[];
  sort?: "newest" | "oldest";
  page?: number;
  limit?: number;
}

export interface ApplyJobDto {
  bankName: string;
  bankAccountNumber: string;
  bvn: string;
}
